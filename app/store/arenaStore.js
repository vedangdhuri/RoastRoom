import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../lib/supabase';

export const useArenaStore = create(
  immer((set) => ({
    arenas: [],
    loading: false,
    error: null,

    fetchArenas: async () => {
      set((state) => { state.loading = true; });
      const { data, error } = await supabase
        .from('arenas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        set((state) => { state.error = error.message; state.loading = false; });
      } else {
        set((state) => { state.arenas = data; state.loading = false; state.error = null; });
      }
    },

    createArena: async (name, description) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('arenas')
        .insert({ name, description, created_by: user.id })
        .select()
        .single();

      if (error) throw error;

      set((state) => { state.arenas.unshift(data); });
      return data;
    },

    deleteArena: async (id) => {
      const { error } = await supabase.from('arenas').delete().eq('id', id);
      if (error) {
        set((state) => { state.error = error.message; });
        throw new Error(error.message);
      }
      set((state) => {
        state.arenas = state.arenas.filter((a) => a.id !== id);
      });
    },
  }))
);
