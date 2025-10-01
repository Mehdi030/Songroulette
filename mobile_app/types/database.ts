export type Database = {
    public: {
        Tables: {
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
                    updated_at?: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    owner_id: string;
                    game_mode: string;
                    platform: string;
                    is_private: boolean;
                    max_rounds: number;
                    is_songs_restricted: boolean;
                    is_buzzer_mode: boolean;
                    game_option?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    owner_id?: string;
                    game_mode?: string;
                    platform?: string;
                    is_private?: boolean;
                    max_rounds?: number;
                    is_songs_restricted?: boolean;
                    is_buzzer_mode?: boolean;
                    game_option?: string;
                    created_at?: string;
                    updated_at?: string;
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
            gameplay_audit: {
                Row: {
                    id: string;
                    round_id: string;
                    player_id: string;
                    answer: string;
                    is_correct: boolean;
                    lobby_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    round_id: string;
                    player_id: string;
                    answer: string;
                    is_correct: boolean;
                    lobby_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    round_id?: string;
                    player_id?: string;
                    answer?: string;
                    is_correct?: boolean;
                    lobby_id?: string;
                    created_at?: string;
                };
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
        };
    };
};
