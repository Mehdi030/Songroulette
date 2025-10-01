import { LobbySettings, GameMode, Lobby, Player } from '../types/game';

export class GameService {
    private lobbies: Lobby[] = [];

    createLobby(settings: LobbySettings): Lobby {
        const lobby: Lobby = {
            settings,
            players: [],
            status: 'waiting',
            current_round: 0,
        };
        this.lobbies.push(lobby);
        return lobby;
    }

    static isValidGameMode(mode: string): mode is GameMode {
        return ['classic', 'tournament', 'speed', 'team'].includes(mode);
    }

    getLobbyById(id: string): Lobby | undefined {
        return this.lobbies.find(lobby => lobby.settings.id === id);
    }

    addPlayer(lobbyId: string, player: Player): boolean {
        const lobby = this.getLobbyById(lobbyId);
        if (lobby && lobby.players.length < lobby.settings.max_players) {
            if (!lobby.players.some(p => p.user_id === player.user_id)) {
                lobby.players.push(player);
                return true;
            }
        }
        return false;
    }

    startGame(lobbyId: string): boolean {
        const lobby = this.getLobbyById(lobbyId);
        if (lobby && lobby.status === 'waiting') {
            lobby.status = 'running';
            lobby.current_round = 1;
            return true;
        }
        return false;
    }

    removeLobby(lobbyId: string): boolean {
        const index = this.lobbies.findIndex(lobby => lobby.settings.id === lobbyId);
        if (index > -1) {
            this.lobbies.splice(index, 1);
            return true;
        }
        return false;
    }
}
