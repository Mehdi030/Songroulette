// Typdefinitionen für Spiel und Lobby – vollständig korrigiert für snake_case

export type GameMode = 'classic' | 'tournament' | 'speed' | 'team';

// Konsistenter Typ für einen Spieler mit DB-Pflichtfeld user_id
export type Player = {
    user_id: string;
    name: string;
};

export type LobbySettings = {
    id: string;
    name: string;
    max_players: number;
    min_players: number;
    has_password?: boolean;
    owner_id: string;
    game_mode: GameMode;
    rounds: number;
    time_limit: number; // Sekunden
    created_at: string; // ISO Timestamp
    // weitere Felder nach Wunsch
};

export type Lobby = {
    settings: LobbySettings;
    players: Player[];
    status: 'waiting' | 'running' | 'finished';
    current_round: number;
};
