import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'expo-router';
import { Button, FlatList, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { Database, Tables, TablesInsert } from '../database.types';

const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
);

const generateId = () => uuidv4();

/*
configureSyncedSupabase({ generateId });

const expenses$ = observable(
    syncedSupabase({
        supabase,
        collection: 'expenses',
        persist: {
            name: 'expenses',
            retrySync: true,
            plugin: observablePersistAsyncStorage({
                AsyncStorage,
            }),
        },
        actions: ['read', 'create', 'update', 'delete'],
        changesSince: 'last-sync',
        fieldCreatedAt: 'created_at',
        fieldUpdatedAt: 'updated_at',
        fieldDeleted: 'deleted',
    }),
);
*/

const state = observable<{ expenses: Tables<'expenses'>[] }>({
    expenses: [],
});

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

const ExpenseList = observer(() => {
    const expenses = state.expenses.get();

    const refreshExpenses = async () => {
        console.log('Refreshing expenses');
        console.log('Current expenses:', expenses);
        const fetchedExpenses = await fetchExpenses();
        console.log('Fetched expenses:', fetchedExpenses);
        state.expenses.set(fetchedExpenses);
        /*const refreshed = expenses$.get();
        console.log('Refreshed expenses:', refreshed);
        expenses$.set(expenses$.get());*/
    };

    const addExpense = async () => {
        const newExpense: TablesInsert<'expenses'> = {
            title: `Expense ${expenses.length + 1}`,
            amount: Math.floor(Math.random() * 100),
        };

        const createdExpense = await createExpense(newExpense);
        if (createdExpense) {
            state.expenses.set([...expenses, createdExpense]);
        }
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
                <Button title='Refresh' onPress={refreshExpenses} />
                <FlatList
                    data={Object.values(expenses)}
                    keyExtractor={(item) => item.id}
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

export default function Index() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Link href='/synced-crud'>Go To Synced Crud</Link>
                <ExpenseList />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
