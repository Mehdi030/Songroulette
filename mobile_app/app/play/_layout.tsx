// mobile_app/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Medofy' }} />
                <Stack.Screen name="login" options={{ title: 'Anmelden' }} />
                <Stack.Screen name="play" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ title: 'Profil' }} />
                <Stack.Screen name="friends" options={{ title: 'Freunde' }} />
                <Stack.Screen name="history" options={{ title: 'Spielhistorie' }} />
            </Stack>
        </>
    );
}
