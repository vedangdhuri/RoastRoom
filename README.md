<div align="center">
  <img src="logo.png" alt="RoastRoom Logo" width="200" />
  <h1>🎙️ RoastRoom - The Ultimate Debate & Roast Arena</h1>
  <p><strong>Win Arguments. Destroy Egos. Earn XP.</strong></p>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Messaging-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

---

## 🔥 What is RoastRoom?

**RoastRoom** is a highly interactive, real-time multiplayer platform where wit meets wisdom. It's the ultimate digital colosseum for users to engage in high-stakes intellectual clashes and ruthless comedic battles. 

Experience the thrill of outsmarting your opponents in a fast-paced environment, all while being dynamically evaluated by an impartial **AI Referee** (powered by advanced LLMs) that scores your arguments in real-time. Whether you are structuring a logical debate or landing a perfectly timed joke, RoastRoom gives you the stage to prove your verbal supremacy.

---

## ✨ Key Features

- **⚡ Real-time Multiplayer**: Powered by Socket.io and Firebase, experience ultra-low latency chat and game synchronization.
- **🤖 AI-Powered Judging**: An integrated AI system (via Supabase Edge Functions / OpenAI / Gemini) automatically analyzes messages textually to detect logic, creativity, clarity, and humor.
- **🛡️ Secure Authentication**: Managed by Supabase Auth with Row Level Security (RLS).
- **🏆 XP & Leaderboard System**: Earn experience points for winning matches, leveling up, and climbing the global ranks.
- **💎 Glassmorphism UI**: A stunning, modern, and highly responsive user interface built using Tailwind CSS and Framer Motion for buttery-smooth animations.

---

## 🎮 Game Modes

RoastRoom offers diverse ways to assert your dominance:

- **⚔️ Debate Mode**: Focus on logic, evidence, and structured arguments. Perfect for testing your rhetorical skills and critical thinking. The AI strictly scores based on factual accuracy, logical flow, and rebuttal strength.
- **🔥 Roast Mode**: Unleash your inner comedian. Score points for creativity, humor, and sheer disrespect (kept within the platform's community guidelines, of course!).
- **👀 Spectator Mode**: Not ready to step into the ring? Join live matches to watch the action unfold! React in real-time with floating emojis, cast your vote for the best arguments in each round, and generate shareable match highlight cards.

---

## 🏗️ Architecture & Tech Stack

RoastRoom adopts a modern, hybrid architecture to leverage the best tools for specific jobs:

### 🎨 Frontend (Client)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Components)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) mapped to a custom Glassmorphic design system.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) handling micro-interactions and route transitions.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for lightweight, predictable global state.
- **Web Sockets**: [Socket.io-client](https://socket.io/) for high-speed bi-directional data flow.

### ⚙️ Backend (Services & State)
- **Relational Data & Auth**: [Supabase](https://supabase.com/) (PostgreSQL). We use Supabase to handle user authentication, relational game data (rooms, participants, scores, XP), and Row Level Security (RLS) enforcement.
- **Real-time Chat Layer**: [Firebase Firestore & FCM](https://firebase.google.com/). Firestore is optimized for sub-100ms read latency on small documents, making it perfect for our chat layer, typing indicators, and presence updates.
- **Serverless AI Processing**: Supabase Edge Functions trigger AI algorithms (OpenAI/Gemini) to evaluate the debate/roast payloads.
- **Node.js/Express Server**: Custom backend services running via Express and Mongoose for extended API handling, cron jobs, and socket state management.

---

## 🤖 The AI Judge Mechanics

Forget biased human voting. Every response in RoastRoom is analyzed in real-time by a sophisticated AI judge. Our model evaluates battles based on:

| Metric | Description |
| :--- | :--- |
| **Logic** | The strength, structure, and coherence of your arguments. |
| **Creativity** | How unique and unexpected your points and angles are. |
| **Clarity** | The readability and articulation of your message. |
| **Humor** | (Roast Mode only) The "burn" factor, wit, and comedic timing. |

---

## 📈 Progression System

Your journey from a novice debater to a Grandmaster Roaster:

- **Level Up**: Earn XP for every match you play. Bonuses are awarded for winning and for exceptional AI-rated "logic" or "humor" streaks.
- **Unlock Badges**: Showcase your dominance with unique badges earned through specific milestones (e.g., "Flawless Logic", "Savage Burn").
- **Global Rankings**: Track your standing against the best roasters and debaters worldwide via dynamic leaderboards.

---

## 🚀 Getting Started Locally

### 📋 Prerequisites

- **Node.js**: `v18.0.0+`
- **npm**: `v9.0.0+`
- **Supabase CLI** (optional, but recommended): `npm i -g supabase`
- **Firebase CLI** (optional): `npm i -g firebase-tools`

### 🔧 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vedangdhuri/RoastRoom.git
   cd RoastRoom/frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Copy the `.env.example` file to create your own `.env.local` configuration.
   ```bash
   cp .env.example .env.local
   ```
   *Make sure to fill in your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_FIREBASE_API_KEY`, and other required credentials.*

4. **Launch the Development Server**:

   ```bash
   npm run dev
   ```
   
   The app will be available at [http://localhost:3000](http://localhost:3000).

*For a complete, in-depth guide on configuring Supabase Edge Functions and Firebase Web Push, check out the [SETUP.md](./SETUP.md) file.*

---

## 🤝 Contributing

We welcome contributions to RoastRoom! Whether it's adding new features, improving the AI judge's prompts, or fixing UI bugs:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <sub>Built with ❤️ by the RoastRoom Team.</sub>
</div>
