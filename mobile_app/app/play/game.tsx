// mobile_app/app/play/game.tsx
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function Game() {
    const [answer, setAnswer] = useState('');
    const [points, setPoints] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (isAnswered) return;
        setTimeLeft(30);
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (!isAnswered) handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isAnswered]);

    const handleSubmit = () => {
        setIsAnswered(true);
        if (answer.trim().toLowerCase() === "shape of you") {
            setPoints(100);
            Alert.alert('Richtig!', 'Du hast den Song erkannt! +100 Punkte');
        } else {
            setPoints(0);
            Alert.alert('Falsch', 'Das war nicht korrekt.');
        }
        setTimeout(() => {
            router.replace('/play/lobby');
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{timeLeft}s</Text>
            <View style={styles.songBox}>
                <Text style={styles.question}>🎵 Welcher Song läuft gerade?</Text>
                <Text style={styles.artist}>von Ed Sheeran</Text>
                <View style={styles.audioPlaceholder}>
                    <Text style={styles.audioText}>🎵 Song-Preview</Text>
                </View>
            </View>
            <TextInput
                style={styles.input}
                value={answer}
                onChangeText={setAnswer}
                placeholder="Songtitel eingeben..."
                placeholderTextColor="#666"
                editable={!isAnswered && timeLeft > 0}
            />
            <Pressable
                style={[styles.submitButton, (isAnswered || timeLeft === 0) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isAnswered || timeLeft === 0}
            >
                <Text style={styles.submitButtonText}>
                    {isAnswered ? 'Geantwortet!' : 'Antwort senden'}
                </Text>
            </Pressable>
            <Text style={styles.points}>{points} Punkte</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Zurück zur Lobby</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    timer: { color: '#9D4EDD', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    songBox: { backgroundColor: '#111', borderRadius: 14, padding: 20, marginBottom: 20, alignItems: 'center' },
    question: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    artist: { color: '#9D4EDD', fontSize: 16, marginBottom: 8 },
    audioPlaceholder: { backgroundColor: '#222', padding: 20, borderRadius: 10, marginBottom: 8 },
    audioText: { color: '#aaa', fontSize: 16 },
    input: { backgroundColor: '#181825', color: '#fff', padding: 14, borderRadius: 10, fontSize: 16, marginBottom: 14 },
    submitButton: { backgroundColor: '#9D4EDD', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
    submitButtonDisabled: { backgroundColor: '#333' },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    points: { color: '#4ADE80', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 18 },
    backButton: { alignItems: 'center', marginTop: 24, backgroundColor: '#222', borderRadius: 8, padding: 12 },
    backButtonText: { color: '#aaa', fontSize: 16 }
});
