import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useArenaStore } from './arenaStore';
import { supabase } from '../lib/supabase';

// Mock Supabase client to isolate store logic from network
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useArenaStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useArenaStore.setState({ arenas: [], loading: false, error: null });
  });

  // ─── fetchArenas ──────────────────────────────────────────────────────

  describe('fetchArenas', () => {
    it('should set loading true, fetch arenas from public.arenas, and populate store', async () => {
      const mockArenas = [
        { id: 'arena-1', name: 'Code Colosseum', description: 'Battle of the devs', created_by: 'user-1' },
        { id: 'arena-2', name: 'Meme Thunderdome', description: 'Meme roasts only', created_by: 'user-2' },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockArenas, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      supabase.from.mockReturnValue({ select: mockSelect });

      await useArenaStore.getState().fetchArenas();

      const state = useArenaStore.getState();
      expect(state.arenas).toEqual(mockArenas);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('arenas');
    });

    it('should handle fetch errors gracefully and set error state', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Connection refused' } });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      supabase.from.mockReturnValue({ select: mockSelect });

      await useArenaStore.getState().fetchArenas();

      const state = useArenaStore.getState();
      expect(state.arenas).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Connection refused');
    });
  });

  // ─── createArena ──────────────────────────────────────────────────────

  describe('createArena', () => {
    it('should throw if user is not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await expect(
        useArenaStore.getState().createArena('My Arena', 'A cool arena')
      ).rejects.toThrow('Not authenticated');
    });

    it('should insert arena into Supabase and prepend it to store on success', async () => {
      const mockUser = { id: 'user-auth-42' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockInsertedArena = {
        id: 'new-arena-id',
        name: 'Gaming Pit',
        description: 'Competitive gaming roasts',
        created_by: 'user-auth-42',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockInsertedArena, error: null });
      const mockSelectChain = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectChain });
      supabase.from.mockReturnValue({ insert: mockInsert });

      const result = await useArenaStore.getState().createArena('Gaming Pit', 'Competitive gaming roasts');

      const state = useArenaStore.getState();
      expect(result).toEqual(mockInsertedArena);
      expect(state.arenas[0]).toEqual(mockInsertedArena);
      expect(supabase.from).toHaveBeenCalledWith('arenas');
      expect(mockInsert).toHaveBeenCalledWith({
        name: 'Gaming Pit',
        description: 'Competitive gaming roasts',
        created_by: 'user-auth-42',
      });
    });

    it('should throw when Supabase insert returns an error', async () => {
      const mockUser = { id: 'user-auth-42' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Duplicate name' } });
      const mockSelectChain = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectChain });
      supabase.from.mockReturnValue({ insert: mockInsert });

      await expect(
        useArenaStore.getState().createArena('Duplicate', 'Again')
      ).rejects.toThrow();
    });
  });

  // ─── deleteArena ──────────────────────────────────────────────────────

  describe('deleteArena', () => {
    it('should delete arena from Supabase and remove it from store', async () => {
      useArenaStore.setState({
        arenas: [
          { id: 'arena-keep', name: 'Keep This' },
          { id: 'arena-delete', name: 'Delete This' },
        ],
      });

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ delete: mockDelete });

      await useArenaStore.getState().deleteArena('arena-delete');

      const state = useArenaStore.getState();
      expect(state.arenas.length).toBe(1);
      expect(state.arenas[0].id).toBe('arena-keep');
      expect(supabase.from).toHaveBeenCalledWith('arenas');
      expect(mockEq).toHaveBeenCalledWith('id', 'arena-delete');
    });

    it('should set error and throw when deletion fails', async () => {
      useArenaStore.setState({
        arenas: [{ id: 'arena-1', name: 'Arena 1' }],
      });

      const mockEq = vi.fn().mockResolvedValue({ error: { message: 'Permission denied' } });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue({ delete: mockDelete });

      await expect(
        useArenaStore.getState().deleteArena('arena-1')
      ).rejects.toThrow('Permission denied');

      const state = useArenaStore.getState();
      expect(state.error).toBe('Permission denied');
      expect(state.arenas.length).toBe(1); // Not removed on failure
    });
  });
});
