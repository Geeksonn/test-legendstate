import { expenses$ } from '@/lib/supabase-legend';
import { useValue } from '@legendapp/state/react';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    const expenses = useValue(expenses$);

    if (!expenses) {
        return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <ActivityIndicator />
                    <Text>Loading your data...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Link href='/other-page'>Go to Other Page</Link>
                <FlatList
                    data={Object.values(expenses)}
                    keyExtractor={(item) => item.id!}
                    renderItem={({ item }) => (
                        <View>
                            <Text>
                                {item.title} - {item.amount}
                            </Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
