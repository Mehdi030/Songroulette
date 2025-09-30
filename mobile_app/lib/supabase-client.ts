import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { CFG } from './config';

const supabaseUrl = CFG.SUPABASE_URL;
const supabaseAnonKey = CFG.SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseHelpers = {
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

    async submitAnswer(roundId: string, playerId: string, answer: string, isCorrect: boolean, lobbyId: string) {
        await supabase.from('gameplay_audit').insert({
            round_id: roundId,
            player_id: playerId,
            answer: answer,
            is_correct: isCorrect,
            lobby_id: lobbyId // Feld aus round holen oder mitgeben
        });

        const points = isCorrect ? 100 : 0;
        const { data, error } = await supabase
            .from('lobby_scores')
            .upsert({ round_id: roundId, player_id: playerId, points });
        return { data, error };
    },

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
            .select('*, profiles(username, avatar_url, display_name)')
            .order('highscore', { ascending: false })
            .limit(10);

        if (gameMode) {
            query = query.eq('game_mode', gameMode);
        }

        const { data, error } = await query;
        return { data, error };
    }
};
