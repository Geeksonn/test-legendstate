import { expenses$ } from '@/lib/supabase-legend';
import { when } from '@legendapp/state';
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
    React.useEffect(() => {
        const loadData = async () => {
            await when(() => expenses$.get());
        };

        loadData();
    }, []);

    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Home' }} />
            <Stack.Screen name='other-page' options={{ title: 'Other Page' }} />
        </Stack>
    );
}
