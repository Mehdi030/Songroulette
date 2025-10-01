import 'dotenv/config'; // Muss ganz oben stehen!

import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto'; // UUID statt nanoid

console.log('SUPABASE_URL:', process.env.SUPABASE_URL); // Debug: Sollte deine URL anzeigen

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
const handleError = (res, error, message = 'Server error') => {
    console.error(message, error);
    res.status(500).json({
        success: false,
        error: message,
        details: error.message
    });
};

// AUTHENTICATION ROUTES
app.post('/auth/demo-login', async (req, res) => {
    try {
        // 1. Erst einen echten Supabase Auth User erstellen
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: `demo${Date.now()}@example.com`, // Eindeutige E-Mail
            password: 'demo123456',
            email_confirm: true
        });

        if (authError) throw authError;

        // 2. Dann das Profile mit der echten Auth-ID erstellen
        const demoUser = {
            id: authData.user.id, // Echte Auth-User-ID verwenden!
            username: `demo_user_${Date.now()}`,
            avatarurl: null,
            createdat: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(demoUser)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: data,
            message: 'Demo login successful'
        });
    } catch (error) {
        handleError(res, error, 'Demo login failed');
    }
});

app.post('/auth/spotify', async (req, res) => {
    try {
        const { code } = req.body;
        // Hier würde normalerweise der Spotify OAuth-Flow stattfinden
        // Für Demo-Zwecke simulieren wir einen erfolgreichen Login
        const spotifyUser = {
            id: randomUUID(), // UUID statt nanoid()
            username: `spotify_user_${randomUUID().slice(0, 6)}`,
            avatarurl: null, // Feldname wie in DB
            createdat: new Date().toISOString() // Feldname wie in DB
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(spotifyUser)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: data,
            message: 'Spotify login successful'
        });
    } catch (error) {
        handleError(res, error, 'Spotify login failed');
    }
});

app.post('/auth/logout', async (req, res) => {
    try {
        const { userId } = req.body;
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        handleError(res, error, 'Logout failed');
    }
});

// LOBBY ROUTES
app.get('/lobbies', async (req, res) => {
    try {
        // Ganz einfach - alle Lobbies ohne Filter
        const { data: lobbies, error } = await supabase
            .from('lobbies')
            .select('*')

        if (error) throw error;

        res.json({
            success: true,
            data: lobbies || [] // Fallback auf leeres Array
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch lobbies');
    }
});



app.post('/lobbies', async (req, res) => {
    try {
        const {
            name,
            ownerid,
            game_mode,
            maxrounds,
            is_genre_restricted,
            is_buzzer_mode,
            isprivate,
            gameoptions
        } = req.body;

        const lobbyData = {
            id: randomUUID(),
            name: name || 'Neue Lobby',
            ownerid,
            game_mode: game_mode || 'guess_the_song', // exakt wie Supabase-Spalte!
            platform: 'spotify',
            isprivate: isprivate || false,
            createdat: new Date().toISOString(),
            maxrounds: maxrounds || 10,
            is_genre_restricted: is_genre_restricted || false, // exakt wie Supabase-Spalte!
            is_buzzer_mode: is_buzzer_mode || false,           // exakt wie Supabase-Spalte!
            gameoptions: gameoptions || {}
        };

        const { data, error } = await supabase
            .from('lobbies')
            .insert(lobbyData)
            .select()
            .single();

        if (error) throw error;

        if (ownerid) {
            await supabase
                .from('lobby_players')
                .insert({
                    lobbyid: data.id,
                    userid: ownerid
                });
        }

        res.json({
            success: true,
            data,
            message: 'Lobby created successfully'
        });
    } catch (error) {
        handleError(res, error, 'Failed to create lobby');
    }
});

app.get('/lobbies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: lobby, error } = await supabase
            .from('lobbies')
            .select(`
        *,
        lobby_players(
          userid,
          joinedat,
          profiles(username, avatarurl)
        ),
        profiles!lobbies_ownerid_fkey(username, avatarurl)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: lobby
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch lobby');
    }
});

app.post('/lobbies/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { userid } = req.body; // Feldname wie in DB

        // Prüfen ob Lobby existiert
        const { data: lobby, error: lobbyError } = await supabase
            .from('lobbies')
            .select('*')
            .eq('id', id)
            .single();

        if (lobbyError) throw new Error('Lobby not found');

        // Prüfen ob User bereits in der Lobby ist
        const { data: existingPlayer } = await supabase
            .from('lobby_players')
            .select('*')
            .eq('lobbyid', id) // Feldname wie in DB
            .eq('userid', userid) // Feldname wie in DB
            .single();

        if (existingPlayer) {
            return res.json({
                success: true,
                message: 'Already in lobby'
            });
        }

        // Spieleranzahl prüfen
        const { count } = await supabase
            .from('lobby_players')
            .select('*', { count: 'exact' })
            .eq('lobbyid', id); // Feldname wie in DB

        if (count >= 8) {
            return res.status(400).json({
                success: false,
                error: 'Lobby is full'
            });
        }

        // User zur Lobby hinzufügen
        const { data, error } = await supabase
            .from('lobby_players')
            .insert({
                lobbyid: id, // Feldname wie in DB
                userid // Feldname wie in DB
            });

        if (error) throw error;

        res.json({
            success: true,
            message: 'Successfully joined lobby'
        });
    } catch (error) {
        handleError(res, error, 'Failed to join lobby');
    }
});

// TEST DATA ROUTES (für Entwicklung)
app.post('/test/seed-songs', async (req, res) => {
    try {
        const testSongs = [
            {
                id: randomUUID(), // UUID statt auto-generated
                title: 'Shape of You',
                artist: 'Ed Sheeran',
                platform: 'spotify',
                externalid: 'test_001', // Feldname wie in DB
                createdat: new Date().toISOString() // Feldname wie in DB
            },
            {
                id: randomUUID(), // UUID statt auto-generated
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                platform: 'spotify',
                externalid: 'test_002', // Feldname wie in DB
                createdat: new Date().toISOString() // Feldname wie in DB
            },
            {
                id: randomUUID(), // UUID statt auto-generated
                title: 'Watermelon Sugar',
                artist: 'Harry Styles',
                platform: 'spotify',
                externalid: 'test_003', // Feldname wie in DB
                createdat: new Date().toISOString() // Feldname wie in DB
            }
        ];

        const { data, error } = await supabase
            .from('songs')
            .upsert(testSongs);

        if (error) throw error;

        res.json({
            success: true,
            message: `${testSongs.length} test songs added`,
            data
        });
    } catch (error) {
        handleError(res, error, 'Failed to seed test songs');
    }
});

// HIGHSCORES ROUTE
app.get('/highscores', async (req, res) => {
    try {
        const { data: highscores, error } = await supabase
            .from('player_highscores')
            .select(`
                *,
                profiles:player_id (
                  id, username, avatarurl
                )
            `)
            .order('highscore', { ascending: false })
            .limit(10);

        if (error) throw error;

        res.json({
            success: true,
            data: highscores
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch highscores');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Medofy Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});