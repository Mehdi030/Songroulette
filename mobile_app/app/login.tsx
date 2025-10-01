import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState("idle"); // idle | loading | success | error

    function handleLogin() {
        setLoginState("loading");

        setTimeout(() => {
             if (username === "demo" && password === "pass123") {
                setLoginState("success");
            } else {
                setLoginState("error");
            }
        }, 800); // Dummy-Request
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, marginBottom: 25 }}>Login</Text>
            <TextInput
                placeholder="Benutzername"
                value={username}
                onChangeText={setUsername}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Passwort"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
            />
            <Button title="Einloggen" onPress={handleLogin} />

            {loginState === "error" && (
                <Text style={{ color: "red", marginTop: 15 }}>
                    Login fehlgeschlagen! Benutzername oder Passwort falsch.
                </Text>
            )}
            {loginState === "success" && (
                <Text style={{ color: "green", marginTop: 15 }}>
                    Login erfolgreich!
                </Text>
            )}
            {loginState === "loading" && (
                <Text style={{ color: "grey", marginTop: 15 }}>
                    Login läuft ...
                </Text>
            )}
        </View>
    );
}
