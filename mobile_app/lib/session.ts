import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
    user_id: string;
    username: string;
    avatar_url?: string | null;
    created_at?: string;
};

export type UserSession = {
    isLoggedIn: boolean;
    user_id?: string;
    username?: string;
    avatar_url?: string | null;
    display_name?: string; // für UI
};

export class SessionManager {
    private static instance: SessionManager;
    private currentSession: UserSession = { isLoggedIn: false };

    private constructor() {
        this.loadSession(); // Session asynchron laden!
    }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    private async loadSession() {
        try {
            const sessionData = await AsyncStorage.getItem('user_session');
            if (sessionData) {
                this.currentSession = JSON.parse(sessionData);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Session', error);
        }
    }

    private async saveSession() {
        try {
            await AsyncStorage.setItem('user_session', JSON.stringify(this.currentSession));
        } catch (error) {
            console.error('Fehler beim Speichern der Session', error);
        }
    }

    public getSession(): UserSession {
        return this.currentSession;
    }

    public async loginDemo() {
        this.currentSession = {
            isLoggedIn: true,
            user_id: 'demo-id',
            username: 'DemoUser',
            display_name: 'DemoUser',
            avatar_url: null,
        };
        await this.saveSession();
        return { success: true };
    }

    public async logout() {
        this.currentSession = { isLoggedIn: false };
        await this.saveSession();
    }
}
