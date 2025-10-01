import { View, Text, StyleSheet, Pressable, FlatList, Alert, Modal, TextInput, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { CFG } from '../../lib/config';

type LobbySettings = {
    name: string;
    owner_id: string;
    game_mode: string;
    platform: string;
    is_private: boolean;
    max_rounds: number;
    is_songs_restricted: boolean;
    is_buzzer_mode: boolean;
    game_option?: string;
};

type Lobby = {
    id: string;
    name: string;
    game_mode: string;
    max_rounds: number;
    is_buzzer_mode: boolean;
    is_private: boolean;
    player_count: number;
    code?: string;
};

export default function LobbyScreen() {
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newLobbySettings, setNewLobbySettings] = useState<LobbySettings>({
        name: 'Neue Lobby',
        owner_id: '', // Die UserID muss bei Lobby-Erstellung gesetzt werden
        game_mode: 'guess_the_song',
        platform: 'spotify',
        is_private: false,
        max_rounds: 10,
        is_songs_restricted: false,
        is_buzzer_mode: false,
        game_option: ''
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
            if (!newLobbySettings.owner_id) {
                Alert.alert('Fehler', 'User ID festlegen!');
                return;
            }

            const lobbyData: LobbySettings = {
                ...newLobbySettings
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
            load();
        } catch (e: any) {
            Alert.alert('Fehler', String(e));
        }
    };

    const gameModeNames: Record<string, string> = {
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
                        <Text style={styles.gameMode}>{gameModeNames[item.game_mode]}</Text>
                        <Text style={styles.details}>
                            {item.max_rounds} Runden • {item.player_count}/8 Spieler
                            {item.is_buzzer_mode && ' • Buzzer-Modus'}
                        </Text>
                        {item.code && <Text style={styles.code}>Code: {item.code}</Text>}
                        <Link href={`/play/game?lobby=${item.id}`} style={styles.link}>Beitreten</Link>
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
                                    newLobbySettings.game_mode === mode && styles.gameModeButtonActive
                                ]}
                                onPress={() => setNewLobbySettings({...newLobbySettings, game_mode: mode})}
                            >
                                <Text style={[
                                    styles.gameModeButtonText,
                                    newLobbySettings.game_mode === mode && styles.gameModeButtonTextActive
                                ]}>{name}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.label}>Rundenzahl: {newLobbySettings.max_rounds}</Text>
                    <View style={styles.sliderContainer}>
                        {[5, 10, 15, 20].map(rounds => (
                            <Pressable
                                key={rounds}
                                style={[
                                    styles.roundButton,
                                    newLobbySettings.max_rounds === rounds && styles.roundButtonActive
                                ]}
                                onPress={() => setNewLobbySettings({...newLobbySettings, max_rounds: rounds})}
                            >
                                <Text style={[
                                    styles.roundButtonText,
                                    newLobbySettings.max_rounds === rounds && styles.roundButtonTextActive
                                ]}>{rounds}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Buzzer-Modus</Text>
                        <Switch
                            value={newLobbySettings.is_buzzer_mode}
                            onValueChange={(value) => setNewLobbySettings({...newLobbySettings, is_buzzer_mode: value})}
                            trackColor={{false: '#333', true: '#9D4EDD'}}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Private Lobby</Text>
                        <Switch
                            value={newLobbySettings.is_private}
                            onValueChange={(value) => setNewLobbySettings({...newLobbySettings, is_private: value})}
                            trackColor={{false: '#333', true: '#9D4EDD'}}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Nur passende Songs</Text>
                        <Switch
                            value={newLobbySettings.is_songs_restricted}
                            onValueChange={(value) => setNewLobbySettings({...newLobbySettings, is_songs_restricted: value})}
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