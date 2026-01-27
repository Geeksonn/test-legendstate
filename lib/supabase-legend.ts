// store/database.ts
import { Database } from '@/database.types';
import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
);

const fetchExpenses = async () => {
    const { data, error } = await supabase.from('expenses').select('*');

    if (error) {
        console.error('Error fetching expenses:', error);
        return [];
    }

    return data;
};

// Configuration générique pour Supabase
function createSupabaseSync(tableName: 'expenses') {
    return syncedCrud({
        list: async () => {
            console.log('Loading data ... ');
            //setTimeout(() => {}, 5000);
            const { data, error } = await supabase.from(tableName).select('*');
            console.log('Data loaded');
            if (error) throw error;
            return data;
        } /*
        create: async (item) => {
            const { data, error } = await supabase.from(tableName).insert(item).select().single();
            if (error) throw error;
            return data;
        },
        update: async (item) => {
            const { data, error } = await supabase
                .from(tableName)
                .update(item)
                .eq('id', item.id!)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (item) => {
            const { error } = await supabase.from(tableName).delete().eq('id', item.id);
            if (error) throw error;
        },
        persist: {
            name: tableName,
            plugin: ObservablePersistAsyncStorage,
        },*/,
        retry: {
            infinite: true,
        },
    });
}

// Créez vos stores synchronisés
export const expenses$ = observable(
    syncedCrud({
        list: fetchExpenses,
        mode: 'assign', // ou 'merge' selon vos besoins
    }),
);

// Store global pour tracker l'état de chargement
export const appSync$ = observable({
    isInitialLoadComplete: false,
    loadingStates: {
        expenses: false,
    },
});
