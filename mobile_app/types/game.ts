// Typdefinitionen für Spiel und Lobby

export type GameMode = 'classic' | 'tournament' | 'speed' | 'team';

// Konsistenter Typ für einen Spieler
export type Player = { id: string; name: string };

export type LobbySettings = {
    id: string;
    name: string;
    maxPlayers: number;
    minPlayers: number;
    hasPassword?: boolean;
    ownerId: string;
    gameMode: GameMode;
    rounds: number;
    timeLimit: number; // Sekunden
    createdAt: string; // ISO
    // weitere Felder nach Wunsch
};

export type Lobby = {
    settings: LobbySettings;
    players: Player[];
    status: 'waiting' | 'running' | 'finished';
    currentRound: number;
};