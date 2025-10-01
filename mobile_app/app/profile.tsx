import { View, Text, Image } from "react-native";

export default function Profile() {
    const profile = {
        username: "DemoUser",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
        games: 12,
        highscore: 740,
        friends: 7
    };

    return (
        <View>
            <Image source={{uri: profile.avatar}} style={{width: 80, height: 80, borderRadius: 40}} />
            <Text>{profile.username}</Text>
            <Text>Spiele: {profile.games}</Text>
            <Text>Highscore: {profile.highscore}</Text>
            <Text>Freunde: {profile.friends}</Text>
        </View>
    );
}
