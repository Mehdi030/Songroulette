// app/index.tsx
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { CFG, validateConfig } from '../lib/config';
import { Session } from '../lib/session';

export default function Home() {
    const [isConfigValid, setIsConfigValid] = useState(false);
    const [userSession, setUserSession] = useState(Session.getSession());

    useEffect(() => {
        setIsConfigValid(validateConfig());
        const session = Session.getSession();
        setUserSession(session);
    }, []);

    // Demo-Login Handler
    const handleDemoLogin = async () => {
        const result = await Session.loginDemo();
        if (result.success) {
            setUserSession(Session.getSession());
        } else {
            console.error('Demo-Login fehlgeschlagen:', result.error);
            // Optional: Alert oder Toast anzeigen
        }
    };

    // Logout Handler
    const handleLogout = async () => {
        await Session.logout();
        setUserSession(Session.getSession());
    };

    if (!isConfigValid) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>⚠️ Konfigurationsfehler</Text>
                <Text style={styles.error}>
                    Bitte überprüfe deine Umgebungsvariablen in app.json
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎵 Medofy</Text>
            <Text style={styles.subtitle}>Musikspiele mit Freunden</Text>

            {userSession.isLoggedIn ? (
                <View style={styles.loggedInContainer}>
                    <Text style={styles.welcomeText}>
                        Willkommen, {userSession.displayName || userSession.username}!
                    </Text>

                    <Link href="/play/lobby" style={styles.primaryLink}>
                        <Text style={styles.primaryLinkText}>🎮 Spielen</Text>
                    </Link>

                    <Link href="/profile" style={styles.secondaryLink}>
                        <Text style={styles.secondaryLinkText}>👤 Profil</Text>
                    </Link>

                    <Pressable
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Abmelden</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.authContainer}>
                    <Text style={styles.authDescription}>
                        Melde dich mit Spotify an, um mit deinen Freunden zu spielen
                    </Text>

                    <Link href="/login" style={styles.primaryLink}>
                        <Text style={styles.primaryLinkText}>🎵 Mit Spotify anmelden</Text>
                    </Link>

                    <Pressable
                        style={[styles.primaryLink, { backgroundColor: '#333' }]}
                        onPress={handleDemoLogin}
                    >
                        <Text style={styles.primaryLinkText}>🎮 Demo-Login</Text>
                    </Pressable>

                    <Link href="/play/lobby" style={styles.guestLink}>
                        <Text style={styles.guestLinkText}>Als Gast spielen</Text>
                    </Link>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    title: {
        color: '#22223b',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8
    },
    subtitle: {
        color: '#4a4e69',
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center'
    },
    error: {
        color: '#b22222',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    loggedInContainer: { alignItems: 'center', gap: 16 },
    welcomeText: {
        color: '#22223b',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20
    },
    authContainer: { alignItems: 'center', gap: 16 },
    authDescription: {
        color: '#4a4e69',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20
    },
    primaryLink: {
        backgroundColor: '#22223b',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center'
    },
    primaryLinkText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    secondaryLink: {
        backgroundColor: '#f2e9e4',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center'
    },
    secondaryLinkText: {
        color: '#22223b',
        fontSize: 16
    },
    guestLink: {
        paddingHorizontal: 20,
        paddingVertical: 12
    },
    guestLinkText: {
        color: '#4a4e69',
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    logoutButton: {
        backgroundColor: '#b22222',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    }
});
