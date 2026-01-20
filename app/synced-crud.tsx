import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'expo-router';
import { Button, FlatList, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { Database, TablesInsert } from '../database.types';

const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
);

const generateId = () => uuidv4();

const fetchExpenses = async () => {
    const { data, error } = await supabase.from('expenses').select('*');

    if (error) {
        console.error('Error fetching expenses:', error);
        return [];
    }

    return data;
};

const createExpense = async (expense: TablesInsert<'expenses'>) => {
    const { data, error } = await supabase.from('expenses').insert(expense).select();

    if (error) {
        console.error('Error adding expense:', error);
        return null;
    }

    return data[0];
};

const expenses$ = observable(
    syncedCrud({
        list: fetchExpenses,
        create: createExpense,
    }),
);

const ExpenseList = observer(() => {
    const expenses = expenses$.get();

    const addExpense = async () => {
        const id = generateId();
        const newExpense: TablesInsert<'expenses'> = {
            id: id,
            title: `Expense ${Object.values(expenses).length + 1}`,
            amount: Math.floor(Math.random() * 100),
        };

        expenses$[id].set(newExpense);

        /*const id = generateId();
        expenses$[id].assign({
            id,
            title: `Expense ${Object.values(expenses).length + 1}`,
            amount: Math.floor(Math.random() * 100),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted: false,
        });*/
    };

    if (expenses) {
        return (
            <View>
                <Button title='Add Expense' onPress={addExpense} />
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
            </View>
        );
    }

    return <></>;
});

export default function SyncedCrud() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Link href='/other-page'>Go To Other Page</Link>
                <ExpenseList />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
