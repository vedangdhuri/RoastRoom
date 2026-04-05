# RoastRoom v2 – Setup Guide

A step-by-step guide to get the full stack running locally and deployed.

---

## Prerequisites

| Tool | Min Version | Install |
|------|-------------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Bundled with Node |
| Supabase CLI | latest | `npm i -g supabase` |
| Firebase CLI | latest | `npm i -g firebase-tools` |

---

## 1. Clone and Install

```bash
git clone <your-repo-url>
cd RoastRoom/frontend
npm install
```

---

## 2. Configure Environment Variables

Copy the template and fill in your real values:

```bash
cp .env.example .env.local
```

Open `.env.local` and populate every variable:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234...
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234:web:abc...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BLP...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Never** commit `.env.local` — it is already listed in `.gitignore`.

---

## 3. Supabase Project Setup

### a. Create a project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **Anon Key** (Settings → API)

### b. Run database migrations

```bash
# Option A – Supabase CLI (recommended)
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# Option B – Paste directly into SQL Editor in the Supabase Dashboard
# Run supabase/migrations/001_initial_schema.sql first
# Then run supabase/migrations/002_rls_policies.sql
```

### c. Verify RLS is active
In the Supabase Dashboard → Table Editor, confirm the shield icon is green on all five tables.

---

## 4. Deploy the Edge Function

Set the required **secrets** in the Supabase dashboard first:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set GEMINI_API_KEY=AIzaSy...
```

Then deploy:

```bash
supabase functions deploy score-debate --no-verify-jwt
```

Test via curl:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/score-debate \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "AI will inevitably surpass human intelligence in every domain.",
    "mode": "debate",
    "matchId": "00000000-0000-0000-0000-000000000000",
    "userId": "00000000-0000-0000-0000-000000000001",
    "round": 1
  }'
```

Expected: JSON with `logic`, `creativity`, `clarity`, `humor`, `total`, `feedback`.

---

## 5. Firebase Project Setup

### a. Create a project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Add project
2. Enable **Firestore** (Native mode, choose your region)
3. Enable **Authentication** (optional — auth is handled by Supabase)
4. Under **Project Settings → General**, copy the Firebase config object into `.env.local`

### b. Deploy Firestore security rules

```bash
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules
```

The rules file is at `frontend/firestore.rules`.

### c. Set up FCM Web Push (optional)

1. Firebase Console → Project Settings → Cloud Messaging → **Web Push certificates**
2. Click **Generate key pair** and copy the VAPID key
3. Paste it as `NEXT_PUBLIC_FIREBASE_VAPID_KEY` in `.env.local`
4. Update `public/firebase-messaging-sw.js` with your actual Firebase config object

---

## 6. Run Locally

```bash
# In one terminal — Next.js frontend
npm run dev

# In another terminal (optional — local Supabase)
supabase start
```

Open [http://localhost:3000](http://localhost:3000).

---

## 7. Verification Checklist

Go through each item after startup:

- [ ] **Auth works** – Register a new account → profile appears in Supabase `users` table
- [ ] **Room creates** – Click "Create Room" in Lobby → redirected to `/room/[id]`
- [ ] **Real-time chat fires** – Open two browser tabs, send a message → appears instantly in both
- [ ] **Typing indicator shows** – Start typing → other tab shows animated dots
- [ ] **AI scoring returns JSON** – Send a message in an active room → score badge appears on message
- [ ] **Turn management works** (Debate) – Submit answer → turn switches to opponent tab
- [ ] **Leaderboard loads** – `/leaderboard` shows users sorted by XP from Supabase

---

## 8. Production Deployment

### Frontend (Vercel recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all `NEXT_PUBLIC_*` variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Backend

- Supabase and Firebase are already hosted — no additional deployment needed
- Edge Function is already deployed via `supabase functions deploy`

---

## Architecture Summary

**Why Supabase for auth and room state, but Firebase for chat?**

Supabase PostgreSQL with RLS is the right choice for structured, relational game data (users, rooms, participants, scores). It provides transactional integrity, type-safe schemas, and server-enforced access control — exactly what you need for room ownership, turn management, and XP accounting.

Firebase Firestore is the right choice for the chat layer because it is optimised for sub-100ms read latency on small documents with high fan-out. Real-time listeners, typing indicators, and presence updates all require the kind of connection-persistent pub/sub model Firestore excels at. Attempting to use Supabase Realtime for chat would require polling fallbacks, whereas Firestore handles reconnection, offline sync, and ordered message streaming natively.

This split avoids the worst of both worlds: Firestore would be a poor choice for relational queries and RLS, while Supabase Realtime would be a poor choice for latency-sensitive chat at scale.
