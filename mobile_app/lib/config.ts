import Constants from 'expo-constants';

export const CFG = {
    // Server & API
    SERVER_URL: (Constants.expoConfig?.extra as any)?.SERVER_URL || 'http://localhost:3000',

    // Supabase
    SUPABASE_URL: (Constants.expoConfig?.extra as any)?.SUPABASE_URL || 'http://dev-supabase-url',
    SUPABASE_ANON_KEY: (Constants.expoConfig?.extra as any)?.SUPABASE_ANON_KEY || 'dev-anon-key',

    // Music Services
    SPOTIFY_CLIENT_ID: (Constants.expoConfig?.extra as any)?.SPOTIFY_CLIENT_ID || '',

    // Game Settings
    GAME_CONFIG: {
        MAX_PLAYERS_PER_LOBBY: 8,
        MIN_PLAYERS_PER_LOBBY: 2,
        DEFAULT_ROUNDS: 10,
        MAX_ROUNDS: 25,
        DEFAULT_TIME_LIMIT: 30,
        POINTS_CORRECT_ANSWER: 100,
        POINTS_QUICK_ANSWER_BONUS: 50,
        ANSWER_TIME_BONUS_THRESHOLD: 10,
    },

    // UI Settings
    UI_CONFIG: {
        PRIMARY_COLOR: '#9D4EDD',
        SECONDARY_COLOR: '#C77DFF',
        BACKGROUND_COLOR: '#000000',
        CARD_BACKGROUND: '#111111',
        TEXT_PRIMARY: '#FFFFFF',
        TEXT_SECONDARY: '#AAAAAA',
        SUCCESS_COLOR: '#4ADE80',
        ERROR_COLOR: '#EF4444',
    }
};

export const validateConfig = (): boolean => {
    const requiredKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    for (const key of requiredKeys) {
        if (!CFG[key as keyof typeof CFG]) {
            console.error(`Missing required config: ${key}`);
            return false;
        }
    }
    return true;
};