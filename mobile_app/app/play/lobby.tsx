// app/play/lobby.tsx - Erweitert
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Modal, TextInput, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { CFG, Session } from '../../lib/config';
import { GameMode, LobbySettings } from '../../types/game';
import { GameService } from '../../lib/game-service'    ;

type Lobby = {
    id: string;
    code?: string;
    name: string;
    gamemode: GameMode;
    maxrounds: number;
    isbuzzermode: boolean;
    player_count: number; // Kommt vom Backend als player_count
};

export default function Lobby() {
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newLobbySettings, setNewLobbySettings] = useState<LobbySettings>({
        name: 'Neue Lobby',
        gamemode: 'guess_the_song',
        maxrounds: 10,
        isgenrerestricted: false,
        isbuzzermode: false,
        isprivate: false,
        gameoptions: {}
    });

    const load = async () => {
        try {
            const r = await fetch(`${CFG.SERVER_URL}/lobbies`);
            const j = await r.json();
            setLobbies(j.data);
        } catch (e: any) {
            Alert.alert('Fehler', String(e));
        }
    };

    useEffect(() => {
        load();
    }, []);

    const createLobby = async () => {
        try {
            if (!Session.userId) {
                Alert.alert('Fehler', 'Du musst eingeloggt sein');
                return;
            }

            // Lobby-Daten mit korrekten Feldnamen für Backend
            const lobbyData = {
                name: newLobbySettings.name,
                ownerid: Session.userId, // Korrigiert: ownerid (nicht owner_id)
                gamemode: newLobbySettings.gamemode,
                maxrounds: newLobbySettings.maxrounds,
                isgenrerestricted: newLobbySettings.isgenrerestricted,
                isbuzzermode: newLobbySettings.isbuzzermode,
                isprivate: newLobbySettings.isprivate,
                gameoptions: newLobbySettings.gameoptions
            };

            const response = await fetch(`${CFG.SERVER_URL}/lobbies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lobbyData)
            });

            const result = await response.json();

            if (!result.success) {
                Alert.alert('Fehler', result.error || 'Lobby konnte nicht erstellt werden');
                return;
            }

            setShowCreateModal(false);
            load(); // Lobbys neu laden
        } catch (e: any) {
            Alert.alert('Fehler', String(e));
        }
    };

    const gameModeNames = {
        'guess_the_song': 'Song erraten',
        'finish_the_lyrics': 'Text ergänzen',
        'music_quiz': 'Musik Quiz'
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lobbys</Text>

            <FlatList
                data={lobbies}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.gameMode}>{gameModeNames[item.gamemode]}</Text>
                        <Text style={styles.details}>
                            {item.maxrounds} Runden • {item.player_count}/8 Spieler
                            {item.isbuzzermode && ' • Buzzer-Modus'}
                        </Text>
                        {item.code && <Text style={styles.code}>Code: {item.code}</Text>}
                        <Link href={`/play/game?lobby=${item.id}`} style={styles.link}>
                            Beitreten
                        </Link>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            <Pressable style={styles.create} onPress={() => setShowCreateModal(true)}>
                <Text style={styles.createText}>Neue Lobby erstellen</Text>
            </Pressable>

            {/* Create Lobby Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Neue Lobby erstellen</Text>

                    <Text style={styles.label}>Lobby Name</Text>
                    <TextInput
                        style={styles.input}
                        value={newLobbySettings.name}
                        onChangeText={(text) => setNewLobbySettings({...newLobbySettings, name: text})}
                        placeholder="Lobby Name eingeben..."
                        placeholderTextColor="#666"
                    />

                    <Text style={styles.label}>Spielmodus</Text>
                    <View style={styles.gameModeContainer}>
                        {Object.entries(gameModeNames).map(([mode, name]) => (
                            <Pressable
                                key={mode}
                                style={[
                                    styles.gameModeButton,
                                    newLobbySettings.gamemode === mode && styles.gameModeButtonActive
                                ]}
                                onPress={() => setNewLobbySettings({...newLobbySettings, gamemode: mode as GameMode})}
                            >
                                <Text style={[
                                    styles.gameModeButtonText,
                                    newLobbySettings.gamemode === mode && styles.gameModeButtonTextActive
                                ]}>{name}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.label}>Rundenzahl: {newLobbySettings.maxrounds}</Text>
                    <View style={styles.sliderContainer}>
                        {[5, 10, 15, 20].map(rounds => (
                            <Pressable
                                key={rounds}
                                style={[
                                    styles.roundButton,
                                    newLobbySettings.maxrounds === rounds && styles.roundButtonActive
                                ]}
                                onPress={() => setNewLobbySettings({...newLobbySettings, maxrounds: rounds})}
                            >
                                <Text style={[
                                    styles.roundButtonText,
                                    newLobbySettings.maxrounds === rounds && styles.roundButtonTextActive
                                ]}>{rounds}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Buzzer-Modus</Text>
                        <Switch
                            value={newLobbySettings.isbuzzermode}
                            onValueChange={(value) => setNewLobbySettings({...newLobbySettings, isbuzzermode: value})}
                            trackColor={{false: '#333', true: '#9D4EDD'}}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Private Lobby</Text>
                        <Switch
                            value={newLobbySettings.isprivate}
                            onValueChange={(value) => setNewLobbySettings({...newLobbySettings, isprivate: value})}
                            trackColor={{false: '#333', true: '#9D4EDD'}}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowCreateModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Abbrechen</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={createLobby}
                        >
                            <Text style={styles.confirmButtonText}>Erstellen</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#111',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    gameMode: {
        color: '#9D4EDD',
        fontSize: 14,
        marginTop: 4,
    },
    details: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
    },
    code: {
        color: '#666',
        fontSize: 12,
        marginTop: 8,
    },
    link: {
        color: '#9D4EDD',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    create: {
        backgroundColor: '#9D4EDD',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    createText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        paddingTop: 60,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#111',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    gameModeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gameModeButton: {
        backgroundColor: '#222',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    gameModeButtonActive: {
        backgroundColor: '#9D4EDD',
    },
    gameModeButtonText: {
        color: '#aaa',
        fontSize: 14,
    },
    gameModeButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    roundButton: {
        flex: 1,
        backgroundColor: '#222',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    roundButtonActive: {
        backgroundColor: '#9D4EDD',
    },
    roundButtonText: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '600',
    },
    roundButtonTextActive: {
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 30,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#333',
    },
    confirmButton: {
        backgroundColor: '#9D4EDD',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});