import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { CFG } from './config';

const supabaseUrl = CFG.SUPABASE_URL;
const supabaseAnonKey = CFG.SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseHelpers = {
    async createLobby(lobbyData: Database['public']['Tables']['lobbies']['Insert']) {
        // Pflichtfelder laut Typ: name, owner_id, game_mode, platform, is_private, max_rounds, is_songs_restricted, is_buzzer_mode
        const { data, error } = await supabase
            .from('lobbies')
            .insert([lobbyData] as Database['public']['Tables']['lobbies']['Insert'][])
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
        const payload: Database['public']['Tables']['lobby_players']['Insert'] = {
            lobby_id: lobbyId,
            user_id: userId
        };
        const { data, error } = await supabase
            .from('lobby_players')
            .insert([payload] as Database['public']['Tables']['lobby_players']['Insert'][])
            .select();
        return { data, error };
    },

    async startGameRound(lobbyId: string, roundNumber: number, songId: string, currentPlayerId: string) {
        const payload: Database['public']['Tables']['lobby_rounds']['Insert'] = {
            lobby_id: lobbyId,
            round_number: roundNumber,
            song_id: songId,
            current_player_id: currentPlayerId
        };
        const { data, error } = await supabase
            .from('lobby_rounds')
            .insert([payload] as Database['public']['Tables']['lobby_rounds']['Insert'][])
            .select()
            .single();
        return { data, error };
    },

    async submitAnswer(roundId: string, playerId: string, answer: string, isCorrect: boolean, lobbyId: string) {
        // gameplay_audit Insert mit typisiertem Payload
        const auditPayload: Database['public']['Tables']['gameplay_audit']['Insert'] = {
            round_id: roundId,
            player_id: playerId,
            answer,
            is_correct: isCorrect,
            lobby_id: lobbyId
        };
        await supabase
            .from('gameplay_audit')
            .insert([auditPayload] as Database['public']['Tables']['gameplay_audit']['Insert'][])
            .select();

        const points = isCorrect ? 100 : 0;
        const scorePayload: Database['public']['Tables']['lobby_scores']['Insert'] = {
            round_id: roundId,
            player_id: playerId,
            points
        };
        const { data, error } = await supabase
            .from('lobby_scores')
            .upsert([scorePayload] as Database['public']['Tables']['lobby_scores']['Insert'][] , { onConflict: 'round_id,player_id' })
            .select();
        return { data, error };
    },

    async updateHighscore(playerId: string, gameMode: string, score: number) {
        const payload: Database['public']['Tables']['player_highscores']['Insert'] = {
            player_id: playerId,
            game_mode: gameMode,
            highscore: score
        };
        const { data, error } = await supabase
            .from('player_highscores')
            .upsert([payload] as Database['public']['Tables']['player_highscores']['Insert'][] , { onConflict: 'player_id,game_mode' })
            .select();
        return { data, error };
    },

    async getHighscores(gameMode?: string) {
        let query = supabase
            .from('player_highscores')
            .select('player_id, game_mode, highscore, updated_at, profiles:player_id (username, avatar_url, display_name)')
            .order('highscore', { ascending: false })
            .limit(10);

        if (gameMode) {
            query = query.eq('game_mode', gameMode);
        }
        const { data, error } = await query;
        return { data, error };
    }
};
