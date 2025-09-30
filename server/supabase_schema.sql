-- supabase_schema.sql
-- Medofy Musikspiele-App - Vollständiges Datenbankschema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Tabelle (erweitert Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
                                        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username text UNIQUE NOT NULL,
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
    );

-- Songs Tabelle
CREATE TABLE IF NOT EXISTS songs (
                                     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    artist text NOT NULL,
    genre text,
    platform text NOT NULL DEFAULT 'spotify',
    platform_song_id text,
    preview_url text,
    duration_ms integer,
    popularity integer,
    created_at timestamp with time zone DEFAULT now()
    );

-- Groups Tabelle (für private Gruppen/Communities)
CREATE TABLE IF NOT EXISTS groups (
                                      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_private boolean DEFAULT true,
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now()
    );

-- Group Members Tabelle
CREATE TABLE IF NOT EXISTS group_members (
                                             group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'member',
    joined_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (group_id, user_id)
    );

-- Playlists Tabelle (als Song-Pool für Games)
CREATE TABLE IF NOT EXISTS playlists (
                                         id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
    );

-- Playlist Items Tabelle
CREATE TABLE IF NOT EXISTS playlist_items (
                                              id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
    song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
    position integer,
    added_at timestamp with time zone DEFAULT now(),
    added_by uuid REFERENCES profiles(id) ON DELETE SET NULL
    );

-- Lobbies Tabelle (Spiel-Lobbys)
CREATE TABLE IF NOT EXISTS lobbies (
                                       id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode text NOT NULL DEFAULT 'guess_the_song',
    platform text NOT NULL DEFAULT 'spotify',
    is_private boolean DEFAULT false,
    max_rounds integer DEFAULT 10,
    is_genre_restricted boolean DEFAULT false,
    is_buzzer_mode boolean DEFAULT false,
    game_options jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'waiting', -- waiting, active, finished
    created_at timestamp with time zone DEFAULT now()
    );

-- Lobby Players Tabelle
CREATE TABLE IF NOT EXISTS lobby_players (
                                             lobby_id uuid REFERENCES lobbies(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at timestamp with time zone DEFAULT now(),
    is_ready boolean DEFAULT false,
    PRIMARY KEY (lobby_id, user_id)
    );

-- Lobby Rounds Tabelle (einzelne Spielrunden)
CREATE TABLE IF NOT EXISTS lobby_rounds (
                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    lobby_id uuid REFERENCES lobbies(id) ON DELETE CASCADE,
    round_number integer NOT NULL,
    song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
    current_player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    started_at timestamp with time zone DEFAULT now(),
    ended_at timestamp with time zone,
                                             status text DEFAULT 'active' -- active, completed, skipped
                                             );

-- Lobby Scores Tabelle (Punktestand pro Runde)
CREATE TABLE IF NOT EXISTS lobby_scores (
                                            round_id uuid REFERENCES lobby_rounds(id) ON DELETE CASCADE,
    player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    points integer NOT NULL DEFAULT 0,
    answer_time_seconds integer,
    PRIMARY KEY (round_id, player_id)
    );

-- Player Highscores Tabelle (Gesamtpunktestand)
CREATE TABLE IF NOT EXISTS player_highscores (
                                                 id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode text NOT NULL,
    highscore integer DEFAULT 0,
    games_played integer DEFAULT 0,
    games_won integer DEFAULT 0,
    total_points integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(player_id, game_mode)
    );

-- Player Achievements Tabelle (Badges/Awards)
CREATE TABLE IF NOT EXISTS player_achievements (
                                                   achievement_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    badge_name text NOT NULL,
    description text,
    category text DEFAULT 'general',
    unlocked_at timestamp with time zone DEFAULT now(),
    UNIQUE(player_id, badge_name)
    );

-- Gameplay Audit Tabelle (für Fairness und Statistiken)
CREATE TABLE IF NOT EXISTS gameplay_audit (
                                              audit_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    lobby_id uuid REFERENCES lobbies(id) ON DELETE CASCADE,
    round_id uuid REFERENCES lobby_rounds(id) ON DELETE CASCADE,
    player_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    action_type text NOT NULL, -- answer, skip, timeout, etc.
    answer text,
    is_correct boolean,
    points_earned integer DEFAULT 0,
    answered_at timestamp with time zone DEFAULT now()
    );

-- Indexes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_platform ON songs(platform);
CREATE INDEX IF NOT EXISTS idx_lobbies_status ON lobbies(status);
CREATE INDEX IF NOT EXISTS idx_lobbies_code ON lobbies(code);
CREATE INDEX IF NOT EXISTS idx_lobby_rounds_lobby_id ON lobby_rounds(lobby_id);
CREATE INDEX IF NOT EXISTS idx_player_highscores_game_mode ON player_highscores(game_mode);
CREATE INDEX IF NOT EXISTS idx_gameplay_audit_lobby_round ON gameplay_audit(lobby_id, round_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobby_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_highscores ENABLE ROW LEVEL SECURITY;

-- RLS Policies für öffentliche Daten
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies für Lobbies
CREATE POLICY "Public lobbies are viewable by everyone" ON lobbies
  FOR SELECT USING (is_private = false OR owner_id = auth.uid());

CREATE POLICY "Users can create lobbies" ON lobbies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their lobbies" ON lobbies
  FOR UPDATE USING (auth.uid() = owner_id);

-- RLS Policies für Lobby Players
CREATE POLICY "Lobby players are viewable by lobby members" ON lobby_players
  FOR SELECT USING (
                 user_id = auth.uid() OR
                 lobby_id IN (SELECT id FROM lobbies WHERE owner_id = auth.uid())
                 );

-- Functions für automatische Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers für automatische Timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_highscores_updated_at BEFORE UPDATE ON player_highscores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed-Daten für Entwicklung
INSERT INTO profiles (id, username, display_name) VALUES
                                                      ('550e8400-e29b-41d4-a716-446655440001', 'demo_user', 'Demo User'),
                                                      ('550e8400-e29b-41d4-a716-446655440002', 'test_user', 'Test User')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO songs (title, artist, genre, platform, platform_song_id) VALUES
                                                                         ('Shape of You', 'Ed Sheeran', 'Pop', 'spotify', 'test_001'),
                                                                         ('Blinding Lights', 'The Weeknd', 'Pop', 'spotify', 'test_002'),
                                                                         ('Watermelon Sugar', 'Harry Styles', 'Pop', 'spotify', 'test_003'),
                                                                         ('Bad Guy', 'Billie Eilish', 'Alternative', 'spotify', 'test_004'),
                                                                         ('Circles', 'Post Malone', 'Hip-Hop', 'spotify', 'test_005'),
                                                                         ('Don\'t Start Now', 'Dua Lipa', 'Dance-Pop', 'spotify', 'test_006'),
  ('Levitating', 'Dua Lipa', 'Dance-Pop', 'spotify', 'test_007'),
  ('Bohemian Rhapsody', 'Queen', 'Rock', 'spotify', 'test_008'),
  ('Hotel California', 'Eagles', 'Rock', 'spotify', 'test_009'),
  ('Imagine', 'John Lennon', 'Rock', 'spotify', 'test_010')
ON CONFLICT DO NOTHING;

-- Beispiel-Achievements definieren
INSERT INTO player_achievements (player_id, badge_name, description, category) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'First Steps', 'Erstes Spiel gespielt', 'beginner'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Music Expert', '10 Songs richtig erraten', 'skill')
ON CONFLICT (player_id, badge_name) DO NOTHING;

COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth';
COMMENT ON TABLE songs IS 'Song database with platform information';
COMMENT ON TABLE lobbies IS 'Game lobbies with configurable game modes';
COMMENT ON TABLE lobby_rounds IS 'Individual game rounds within lobbies';
COMMENT ON TABLE player_highscores IS 'Player statistics and highscores per game mode';
COMMENT ON TABLE gameplay_audit IS 'Audit trail for game actions and answers';