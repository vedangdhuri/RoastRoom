-- ============================================================
-- RoastRoom v2 – Migration 001: Initial Schema
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT NOT NULL,
  xp          INTEGER DEFAULT 0 NOT NULL,
  level       INTEGER DEFAULT 1 NOT NULL,
  wins        INTEGER DEFAULT 0 NOT NULL,
  badges      TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode           TEXT NOT NULL CHECK (mode IN ('debate', 'roast')),
  topic          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  current_round  INTEGER DEFAULT 1 NOT NULL,
  current_turn   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_by     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Room participants table
CREATE TABLE IF NOT EXISTS public.room_participants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'spectator')),
  joined_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (room_id, user_id)
);

-- Matches table (one record per completed game)
CREATE TABLE IF NOT EXISTS public.matches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  winner_id   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  mode        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Scores table (per-round AI scoring results)
CREATE TABLE IF NOT EXISTS public.scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  round       INTEGER DEFAULT 1 NOT NULL,
  logic       NUMERIC(4,2),
  creativity  NUMERIC(4,2),
  clarity     NUMERIC(4,2),
  humor       NUMERIC(4,2),
  total       NUMERIC(5,2),
  feedback    TEXT,
  scored_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_match_id ON public.scores(match_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON public.scores(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-calculate level from XP: level = FLOOR(SQRT(xp / 100))
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = GREATEST(1, FLOOR(SQRT(NEW.xp::FLOAT / 100))::INTEGER);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_level
  BEFORE UPDATE OF xp ON public.users
  FOR EACH ROW
  WHEN (OLD.xp IS DISTINCT FROM NEW.xp)
  EXECUTE FUNCTION public.update_user_level();

-- Award XP after a match is resolved
-- win = +100 XP, loss = +40 XP
CREATE OR REPLACE FUNCTION public.award_match_xp(
  p_winner_id   UUID,
  p_loser_id    UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users SET xp = xp + 100, wins = wins + 1
  WHERE id = p_winner_id;

  UPDATE public.users SET xp = xp + 40
  WHERE id = p_loser_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
