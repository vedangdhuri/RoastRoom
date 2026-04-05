-- ============================================================
-- RoastRoom v2 – Migration 002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores          ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS
-- ============================================================

-- Anyone authenticated can read any profile
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only update their own row
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile row (triggered at signup)
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- ROOMS
-- ============================================================

-- All authenticated users can read rooms
CREATE POLICY "rooms_select_all" ON public.rooms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create rooms
CREATE POLICY "rooms_insert_auth" ON public.rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the creator can update the room
CREATE POLICY "rooms_update_creator" ON public.rooms
  FOR UPDATE USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ============================================================
-- ROOM_PARTICIPANTS
-- ============================================================

-- Users can read participants in rooms they are part of
CREATE POLICY "participants_select_own_rooms" ON public.room_participants
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.room_participants rp
      WHERE rp.room_id = room_participants.room_id
        AND rp.user_id = auth.uid()
    )
  );

-- Users can join rooms themselves
CREATE POLICY "participants_insert_self" ON public.room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave / be removed
CREATE POLICY "participants_delete_self" ON public.room_participants
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- MATCHES
-- ============================================================

-- All authenticated users can read match records
CREATE POLICY "matches_select_all" ON public.matches
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role (Edge Function) can insert matches
-- No INSERT policy for anon/authenticated — service role bypasses RLS

-- ============================================================
-- SCORES
-- ============================================================

-- All authenticated users can read scores
CREATE POLICY "scores_select_all" ON public.scores
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role (Edge Function) can insert scores
-- No INSERT policy for anon/authenticated — service role bypasses RLS
