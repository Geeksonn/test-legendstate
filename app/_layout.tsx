import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Home' }} />
            <Stack.Screen name='synced-crud' options={{ title: 'Synced CRUD' }} />
            <Stack.Screen name='other-page' options={{ title: 'Other Page' }} />
        </Stack>
    );
}
