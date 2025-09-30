// Singleton-Sessionmanager für Benutzersitzung und -daten

import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
    id: string;
    username: string;
    avatarUrl?: string | null;
    createdAt?: string;
};

export type UserSession = {
    isLoggedIn: boolean;
    userId?: string;
    username?: string;
    avatarUrl?: string | null;
    displayName?: string; // für UI
};

export class SessionManager {
    private static instance: SessionManager;
    private currentSession: UserSession = { isLoggedIn: false };

    private constructor() {
        this.loadSession(); // Session beim Start laden (async beachten!)
    }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    // Session laden (asynchron!)
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

    // Session speichern (asynchron!)
    private async saveSession() {
        try {
            await AsyncStorage.setItem('user_session', JSON.stringify(this.currentSession));
        } catch (error) {
            console.error('Fehler beim Speichern der Session', error);
        }
    }

    // Gibt die aktuelle Session synchron zurück (letzter gespeicherter Stand im RAM)
    public getSession(): UserSession {
        return this.currentSession;
    }

    // Demo-Login setzt UserSession auf einen Demo-User (und persistiert das)
    public async loginDemo() {
        this.currentSession = {
            isLoggedIn: true,
            userId: 'demo-id',
            username: 'DemoUser',
            displayName: 'DemoUser',
            avatarUrl: null,
        };
        await this.saveSession();
        return { success: true };
    }

    // Logout setzt auf leeres Session-Objekt und speichert dies ebenfalls
    public async logout() {
        this.currentSession = { isLoggedIn: false };
        await this.saveSession();
    }
}
