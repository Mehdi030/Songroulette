import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

export default function Friends() {
    const [friendName, setFriendName] = useState("");
    const [friends, setFriends] = useState([
        { id: 1, name: "Max" },
        { id: 2, name: "Anna" },
        { id: 3, name: "Ben" }
    ]);

    function addFriend() {
        if(friendName.trim() !== "") {
            setFriends([...friends, { id: Date.now(), name: friendName }]);
            setFriendName("");
        }
    }

    return (
        <View>
            <TextInput value={friendName} onChangeText={setFriendName} placeholder="Freund hinzufügen" />
            <Button title="Hinzufügen" onPress={addFriend} />
            <Text>Freunde:</Text>
            {friends.map((f) => (
                <Text key={f.id}>{f.name}</Text>
            ))}
        </View>
    );
}
