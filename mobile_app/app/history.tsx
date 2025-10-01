import { View, Text } from "react-native";

export default function History() {
    const games = [
        { id: 1, date: "2025-09-28", mode: "Classic", points: 740 },
        { id: 2, date: "2025-09-25", mode: "Speedrun", points: 530 }
    ];

    return (
        <View>
            <Text>Spielhistorie:</Text>
            {games.map((g) => (
                <Text key={g.id}>
                    {g.date} - {g.mode} - {g.points} Punkte
                </Text>
            ))}
        </View>
    );
}
