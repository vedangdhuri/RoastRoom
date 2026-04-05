import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../lib/supabase';

export const useRoomStore = create(
  immer((set, get) => ({
    rooms: [],
    currentRoom: null,
    participants: [],
    loading: false,
    error: null,
    filter: { mode: 'all', status: 'all' },

    // Fetch all rooms
    fetchRooms: async () => {
      set((state) => { state.loading = true; });
      try {
        let query = supabase.from('rooms').select('*, room_participants(*)').order('created_at', { ascending: false });

        const { mode, status } = get().filter;
        if (mode !== 'all') query = query.eq('mode', mode);
        if (status !== 'all') query = query.eq('status', status);

        const { data, error } = await query;
        if (error) throw error;
        set((state) => { state.rooms = data || []; state.loading = false; });
      } catch (error) {
        set((state) => { state.error = error.message; state.loading = false; });
      }
    },

    // Create a new room
    createRoom: async (mode, topic) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('rooms')
          .insert({ mode, topic, created_by: user.id, status: 'waiting' })
          .select()
          .single();
        if (error) throw error;

        // Auto-join as player
        await supabase.from('room_participants').insert({
          room_id: data.id,
          user_id: user.id,
          role: 'player',
        });

        return data;
      } catch (error) {
        set((state) => { state.error = error.message; });
        throw error;
      }
    },

    // Join a room
    joinRoom: async (roomId, role = 'player') => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        await supabase.from('room_participants').insert({
          room_id: roomId,
          user_id: user.id,
          role,
        });

        await get().fetchRoom(roomId);
      } catch (error) {
        set((state) => { state.error = error.message; });
        throw error;
      }
    },

    // Fetch single room details
    fetchRoom: async (roomId) => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*, room_participants(*, users(*))')
          .eq('id', roomId)
          .single();
        if (error) throw error;
        set((state) => {
          state.currentRoom = data;
          state.participants = data.room_participants || [];
        });
        return data;
      } catch (error) {
        set((state) => { state.error = error.message; });
        throw error;
      }
    },

    // Update room status
    updateRoomStatus: async (roomId, status) => {
      const { error } = await supabase
        .from('rooms')
        .update({ status })
        .eq('id', roomId);
      if (!error) {
        set((state) => {
          if (state.currentRoom?.id === roomId) {
            state.currentRoom.status = status;
          }
        });
      }
    },

    // Update turn
    setCurrentTurn: async (roomId, userId) => {
      await supabase.from('rooms').update({ current_turn: userId }).eq('id', roomId);
      set((state) => {
        if (state.currentRoom) state.currentRoom.current_turn = userId;
      });
    },

    // Advance round
    advanceRound: async (roomId) => {
      const current = get().currentRoom?.current_round || 1;
      await supabase.from('rooms').update({ current_round: current + 1 }).eq('id', roomId);
      set((state) => {
        if (state.currentRoom) state.currentRoom.current_round = current + 1;
      });
    },

    setFilter: (filter) => set((state) => { state.filter = { ...state.filter, ...filter }; }),
    clearCurrentRoom: () => set((state) => { state.currentRoom = null; state.participants = []; }),
  }))
);
