import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function OtherPage() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>Other Page</Text>

                <Link href='/synced-crud'>Go To Synced Crud</Link>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
