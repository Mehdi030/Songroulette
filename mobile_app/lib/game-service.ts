// Serviceklasse für Lobby- und Spielaktionen

import { LobbySettings, GameMode, Lobby, Player } from '../types/game';

export class GameService {
    private lobbies: Lobby[] = [];

    // Neue Lobby erzeugen
    createLobby(settings: LobbySettings): Lobby {
        const lobby: Lobby = {
            settings,
            players: [],
            status: 'waiting',
            currentRound: 0,
        };
        this.lobbies.push(lobby);
        return lobby;
    }

    // Spielmodus validieren
    static isValidGameMode(mode: string): mode is GameMode {
        return ['classic', 'tournament', 'speed', 'team'].includes(mode);
    }

    // Lobby suchen nach Id
    getLobbyById(id: string): Lobby | undefined {
        return this.lobbies.find(lobby => lobby.settings.id === id);
    }

    // Spieler zu Lobby hinzufügen
    addPlayer(lobbyId: string, player: Player): boolean {
        const lobby = this.getLobbyById(lobbyId);
        if (lobby && lobby.players.length < lobby.settings.maxPlayers) {
            // Neu: Duplikatscheck
            if (!lobby.players.some(p => p.id === player.id)) {
                lobby.players.push(player);
                return true;
            }
        }
        return false;
    }

    // Spiel starten
    startGame(lobbyId: string): boolean {
        const lobby = this.getLobbyById(lobbyId);
        if (lobby && lobby.status === 'waiting') {
            lobby.status = 'running';
            lobby.currentRound = 1;
            return true;
        }
        return false;
    }

    // Lobby löschen
    removeLobby(lobbyId: string): boolean {
        const index = this.lobbies.findIndex(lobby => lobby.settings.id === lobbyId);
        if (index > -1) {
            this.lobbies.splice(index, 1);
            return true;
        }
        return false;
    }
}
