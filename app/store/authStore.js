import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../lib/supabase';

export const useAuthStore = create(
  immer((set, get) => ({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,

    // Initialize auth state from Supabase session
    initialize: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set((state) => {
            state.session = session;
            state.user = session.user;
            state.loading = false;
          });
          // Fetch full profile from users table
          await get().fetchProfile(session.user.id);
        } else {
          set((state) => {
            state.loading = false;
          });
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          set((state) => {
            state.session = session;
            state.user = session?.user ?? null;
          });
          if (session?.user) {
            await get().fetchProfile(session.user.id);
          } else {
            set((state) => {
              state.profile = null;
            });
          }
        });
      } catch (error) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    // Fetch user profile from Supabase users table
    fetchProfile: async (userId) => {
      try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        // Row doesn't exist yet — create a fallback profile
        if (error && error.code === 'PGRST116') {
          const { data: { user } } = await supabase.auth.getUser();
          const fallbackUsername =
            user?.user_metadata?.username ||
            user?.email?.split('@')[0] ||
            'Roaster';
          const { data: upserted, error: upsertErr } = await supabase
            .from('users')
            .upsert({
              id: userId,
              username: fallbackUsername,
              email: user?.email,
            })
            .select()
            .single();
          if (upsertErr) throw upsertErr;
          data = upserted;
        } else if (error) {
          throw error;
        }

        set((state) => {
          state.profile = data;
        });
      } catch (error) {
        console.warn('Profile fetch failed:', error.message);
      }
    },

    // Sign up with email, password, username
    signUp: async (email, password, username) => {
      set((state) => { state.loading = true; state.error = null; });
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;

        // Upsert into public users table (trigger may have already created the row)
        if (data.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            username,
            email,
          });
        }

        set((state) => { state.loading = false; });
        return data;
      } catch (error) {
        set((state) => { state.error = error.message; state.loading = false; });
        throw error;
      }
    },

    // Sign in with email + password
    signIn: async (email, password) => {
      set((state) => { state.loading = true; state.error = null; });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        set((state) => { state.loading = false; });
        return data;
      } catch (error) {
        set((state) => { state.error = error.message; state.loading = false; });
        throw error;
      }
    },

    // Sign out
    signOut: async () => {
      await supabase.auth.signOut();
      set((state) => {
        state.user = null;
        state.profile = null;
        state.session = null;
      });
    },

    clearError: () => set((state) => { state.error = null; }),
  }))
);
