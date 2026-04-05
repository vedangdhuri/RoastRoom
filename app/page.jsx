"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "./store/authStore";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FEATURES = [
  {
    icon: "🎯",
    title: "Pick a Topic & Mode",
    desc: "Choose between intellectual debates or ruthless comedy roasts. Set the topic and challenge the lobby.",
    accent: "from-brand-600/20 to-brand-600/5",
  },
  {
    icon: "⏱️",
    title: "Battle in Real-Time",
    desc: "Take turns dropping your best arguments before the timer runs out. Use logic or sheer disrespect.",
    accent: "from-accent-blue/20 to-accent-blue/5",
  },
  {
    icon: "🤖",
    title: "AI Judgment",
    desc: "Our impartial GPT-4o judge scores every response on logic, humor, creativity, and clarity.",
    accent: "from-accent-orange/20 to-accent-orange/5",
  },
];

const STATS = [
  { value: "2,847", label: "Active Players" },
  { value: "12K+", label: "Battles Fought" },
  { value: "94%", label: "Top Win Rate" },
  { value: "4.8s", label: "Avg. AI Score Time" },
];

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* === HERO SECTION === */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-32 md:pb-36 text-center">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-700/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-accent-orange/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 inline-block mb-8 px-5 py-2 rounded-full bg-brand-700/10 border border-brand-500/15 text-brand-400 font-label font-semibold text-xs tracking-wider uppercase"
        >
          🔥 The Ultimate Roasting Arena
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-[0.95] tracking-tight"
        >
          Win Arguments.
          <br />
          <span className="text-gradient">Destroy Egos.</span>
          <br />
          Earn XP.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative z-10 text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join real-time debate and roast battles. Outsmart your opponents, get
          scored by AI in real-time, and climb the global leaderboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {user ? (
            <Link
              href="/lobby"
              className="btn-primary text-base px-10 py-4 w-full sm:w-auto animate-glow"
            >
              Enter the Arena ⚔️
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="btn-primary text-base px-10 py-4 w-full sm:w-auto animate-glow"
              >
                Start Battling Now
              </Link>
              <Link
                href="/leaderboard"
                className="btn-outline text-base px-10 py-4 w-full sm:w-auto"
              >
                View Leaderboard
              </Link>
            </>
          )}
        </motion.div>

        {/* Floating mode badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex justify-center gap-6 mt-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue/8 border border-accent-blue/15">
            <span className="text-accent-blue text-lg">⚔️</span>
            <span className="text-sm font-medium text-accent-blue/80">Debate Mode</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-orange/8 border border-accent-orange/15">
            <span className="text-accent-orange text-lg">🔥</span>
            <span className="text-sm font-medium text-accent-orange/80">Roast Mode</span>
          </div>
        </motion.div>
      </section>

      {/* === STATS BAR === */}
      <section className="w-full bg-surface-500 border-y border-white/[0.04] py-8">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <p className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                  {stat.value}
                </p>
                <p className="hud-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Three simple steps to establish your dominance.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                className="group relative card-glass hover:bg-white/[0.05] cursor-default"
              >
                {/* Subtle gradient glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="text-4xl mb-5 group-hover:animate-float">{feature.icon}</div>
                  <h3 className="font-display font-bold text-xl mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === MODES COMPARISON === */}
      <section className="w-full py-24 bg-surface-500">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-3 tracking-tight">
              Choose Your Weapon
            </h2>
            <p className="text-gray-500 text-lg">Two modes. One champion.</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Debate Card */}
            <motion.div
              variants={item}
              className="relative card-glass overflow-hidden group hover:border-accent-blue/20"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue to-brand-500" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Debate Mode</h3>
                  <p className="text-xs text-accent-blue font-label uppercase tracking-wider">Intellectual Sparring</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-accent-blue mt-0.5">▸</span> Turn-based: alternate 90-second rounds</li>
                <li className="flex items-start gap-2"><span className="text-accent-blue mt-0.5">▸</span> Scored on Logic (40%), Clarity (30%)</li>
                <li className="flex items-start gap-2"><span className="text-accent-blue mt-0.5">▸</span> Best of 3 rounds determines winner</li>
                <li className="flex items-start gap-2"><span className="text-accent-blue mt-0.5">▸</span> Structured argument cards with AI feedback</li>
              </ul>
            </motion.div>

            {/* Roast Card */}
            <motion.div
              variants={item}
              className="relative card-glass overflow-hidden group hover:border-accent-orange/20"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-orange to-accent-red" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-accent-orange/10 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Roast Mode</h3>
                  <p className="text-xs text-accent-orange font-label uppercase tracking-wider">Savage Freefire</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-accent-orange mt-0.5">▸</span> Free-for-all: 60-second simultaneous window</li>
                <li className="flex items-start gap-2"><span className="text-accent-orange mt-0.5">▸</span> Scored on Humor (40%), Creativity (30%)</li>
                <li className="flex items-start gap-2"><span className="text-accent-orange mt-0.5">▸</span> 🔥 flames on high-scoring messages</li>
                <li className="flex items-start gap-2"><span className="text-accent-orange mt-0.5">▸</span> Rapid-fire chat, crowd reactions, chaos</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative card-glass p-10 md:p-14 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-brand-600/12 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-accent-orange/8 blur-[60px] pointer-events-none" />

          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 relative z-10 tracking-tight">
            Think you have what it takes?
          </h2>
          <p className="text-gray-400 mb-8 relative z-10 max-w-lg mx-auto leading-relaxed">
            Every win earns you XP. Level up, unlock badges, and cement your
            legacy on the global leaderboard.
          </p>
          <div className="relative z-10">
            <Link
              href={user ? "/lobby" : "/register"}
              className="btn-primary px-10 py-4 text-base"
            >
              {user ? "Find a Match ⚔️" : "Create Free Account"}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* === FOOTER === */}
      <footer className="w-full border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-accent-orange flex items-center justify-center text-white font-display font-bold text-[10px]">
              R
            </div>
            <span className="font-display font-semibold text-sm text-gray-500">
              RoastRoom © 2026
            </span>
          </div>
          <p className="text-xs text-gray-600 font-label">
            Built with AI judgment. No feelings were spared.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
