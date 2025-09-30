// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import { CFG } from '../lib/config';

const supabaseUrl = CFG.SUPABASE_URL;
const supabaseAnonKey = CFG.SUPABASE_ANON_KEY;

export type Database = {
    public: {
        Tables: {
            playlist_items: {
                Row: {
                    playlist_id: string;
                    song_id: string;
                    added_at: string;
                };
                Insert: {
                    playlist_id: string;
                    song_id: string;
                    added_at?: string;
                };
                Update: {
                    playlist_id?: string;
                    song_id?: string;
                    added_at?: string;
                };
            };
            lobby_players: {
                Row: {
                    lobby_id: string;
                    user_id: string;
                    joined_at: string;
                };
                Insert: {
                    lobby_id: string;
                    user_id: string;
                    joined_at?: string;
                };
                Update: {
                    lobby_id?: string;
                    user_id?: string;
                    joined_at?: string;
                };
            };
            lobby_scores: {
                Row: {
                    round_id: string;
                    player_id: string;
                    points: number;
                };
                Insert: {
                    round_id: string;
                    player_id: string;
                    points: number;
                };
                Update: {
                    round_id?: string;
                    player_id?: string;
                    points?: number;
                };
            };
            lobby_rounds: {
                Row: {
                    lobby_id: string;
                    round_number: number;
                    song_id: string;
                    current_player_id: string;
                    started_at: string;
                };
                Insert: {
                    lobby_id: string;
                    round_number: number;
                    song_id: string;
                    current_player_id: string;
                    started_at?: string;
                };
                Update: {
                    lobby_id?: string;
                    round_number?: number;
                    song_id?: string;
                    current_player_id?: string;
                    started_at?: string;
                };
            };
            lobbies: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    game_mode: string;
                    platform: string;
                    is_private: boolean;
                    max_rounds: number;
                    is_songs_restricted: boolean;
                    is_buzzer_mode: boolean;
                    game_option?: string;
                    created_at: string;
                    gamemode?: string;
                    isbuzzermode?: boolean;
                    isgamesrestricted?: boolean;
                    maxrounds?: number;
                    lobbystatus?: string;
                    updated_at?: string;
                };
                Insert: Partial<Omit<LobbiesRow, 'id' | 'created_at'>>;
                Update: Partial<LobbiesRow>;
            };
            player_highscores: {
                Row: {
                    player_id: string;
                    game_mode: string;
                    highscore: number;
                    updated_at: string;
                };
                Insert: {
                    player_id: string;
                    game_mode: string;
                    highscore: number;
                    updated_at?: string;
                };
                Update: {
                    player_id?: string;
                    game_mode?: string;
                    highscore?: number;
                    updated_at?: string;
                };
            };
            player_achievements: {
                Row: {
                    player_id: string;
                    badge_name: string;
                    description: string;
                    unlocked_at: string;
                };
                Insert: {
                    player_id: string;
                    badge_name: string;
                    description: string;
                    unlocked_at?: string;
                };
                Update: {
                    player_id?: string;
                    badge_name?: string;
                    description?: string;
                    unlocked_at?: string;
                };
            };
            playlists: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    is_private: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    owner_id: string;
                    is_private?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    owner_id?: string;
                    is_private?: boolean;
                    created_at?: string;
                };
            };
            playlistitems: {
                Row: {
                    playlistid: string;
                    songid: string;
                    addedat: string;
                };
                Insert: {
                    playlistid: string;
                    songid: string;
                    addedat?: string;
                };
                Update: {
                    playlistid?: string;
                    songid?: string;
                    addedat?: string;
                };
            };
            songs: {
                Row: {
                    id: string;
                    title: string;
                    artist: string;
                    platform: string;
                    external_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    artist: string;
                    platform: string;
                    external_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    artist?: string;
                    platform?: string;
                    external_id?: string;
                    created_at?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    avatar_url: string;
                    created_at: string;
                    display_name: string;
                };
                Insert: {
                    id?: string;
                    username: string;
                    avatar_url?: string;
                    created_at?: string;
                    display_name?: string;
                };
                Update: {
                    id?: string;
                    username?: string;
                    avatar_url?: string;
                    created_at?: string;
                    display_name?: string;
                };
            };
            groups: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    created_at: string;
                    display_name: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    owner_id: string;
                    created_at?: string;
                    display_name?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    owner_id?: string;
                    created_at?: string;
                    display_name?: string;
                };
            };
            groupmembers: {
                Row: {
                    groupid: string;
                    userid: string;
                    role: string;
                    joinedat: string;
                };
                Insert: {
                    groupid: string;
                    userid: string;
                    role: string;
                    joinedat?: string;
                };
                Update: {
                    groupid?: string;
                    userid?: string;
                    role?: string;
                    joinedat?: string;
                };
            };
            playstations: {
                Row: {
                    playlistid: string;
                    songid: string;
                    addedat: string;
                };
                Insert: {
                    playlistid: string;
                    songid: string;
                    addedat?: string;
                };
                Update: {
                    playlistid?: string;
                    songid?: string;
                    addedat?: string;
                };
            };
        };
    };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common queries
export const supabaseHelpers = {
    // Lobby operations
    async createLobby(lobbyData: any) {
        const { data, error } = await supabase
            .from('lobbies')
            .insert(lobbyData)
            .select()
            .single();
        return { data, error };
    },

    async getLobby(lobbyId: string) {
        const { data, error } = await supabase
            .from('lobbies')
            .select('*')
            .eq('id', lobbyId)
            .single();
        return { data, error };
    },

    async joinLobby(lobbyId: string, userId: string) {
        const { data, error } = await supabase
            .from('lobby_players')
            .insert({ lobby_id: lobbyId, user_id: userId });
        return { data, error };
    },

    // Game operations
    async startGameRound(lobbyId: string, roundNumber: number, songId: string, currentPlayerId: string) {
        const { data, error } = await supabase
            .from('lobby_rounds')
            .insert({
                lobby_id: lobbyId,
                round_number: roundNumber,
                song_id: songId,
                current_player_id: currentPlayerId
            })
            .select()
            .single();
        return { data, error };
    },

    async submitAnswer(roundId: string, playerId: string, answer: string, isCorrect: boolean) {
        // Log answer in audit table
        await supabase.from('gameplay_audit').insert({
            round_id: roundId,
            player_id: playerId,
            answer: answer,
            is_correct: isCorrect,
            lobby_id: '', // Will need to be filled from round data
        });

        // Update score
        const points = isCorrect ? 100 : 0; // Base scoring logic
        const { data, error } = await supabase
            .from('lobby_scores')
            .upsert({ round_id: roundId, player_id: playerId, points });
        return { data, error };
    },

    // Highscore operations
    async updateHighscore(playerId: string, gameMode: string, score: number) {
        const { data, error } = await supabase
            .from('player_highscores')
            .upsert({
                player_id: playerId,
                game_mode: gameMode,
                highscore: score
            });
        return { data, error };
    },

    async getHighscores(gameMode?: string) {
        let query = supabase
            .from('player_highscores')
            .select('*, profiles(username, display_name)')
            .order('highscore', { ascending: false })
            .limit(10);

        if (gameMode) {
            query = query.eq('game_mode', gameMode);
        }

        const { data, error } = await query;
        return { data, error };
    }
};