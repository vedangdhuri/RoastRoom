"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const XPProgressBar = ({ xp, level }) => {
  const baseXP = level * level * 100;
  const nextLevelXP = (level + 1) * (level + 1) * 100;
  const progress = Math.min(((xp - baseXP) / (nextLevelXP - baseXP)) * 100, 100);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="hud-label">Level {level}</span>
        <span className="font-mono text-gray-400 text-xs">
          {xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
        </span>
      </div>
      <div className="h-3 w-full bg-dark-400 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-accent-orange relative rounded-full"
        >
          <div className="absolute inset-0 bg-white/10 animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

const BADGE_MAP = {
  first_win: { emoji: "🥇", label: "First Victory" },
  five_wins: { emoji: "⭐", label: "5 Wins" },
  ten_wins: { emoji: "🏆", label: "10 Wins" },
  roast_king: { emoji: "🔥", label: "Roast Master" },
  debate_legend: { emoji: "🎓", label: "Debate Scholar" },
  high_scorer: { emoji: "💯", label: "Max Score" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const DashboardPage = () => {
  const { user, profile } = useAuthStore();
  const [stats, setStats] = useState({ wins: 0, losses: 0, winRate: 0, streak: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch match history with scores
        const { data: matches } = await supabase
          .from("matches")
          .select("*")
          .or(`winner_id.eq.${profile.id}`)
          .order("created_at", { ascending: false })
          .limit(10);

        setHistory(matches || []);

        // Calculate stats
        const totalWins = profile.wins || 0;
        const totalMatches = (matches || []).length;
        const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

        setStats({
          wins: totalWins,
          losses: Math.max(0, totalMatches - totalWins),
          winRate,
          streak: 0, // TODO: Calculate real streak
        });
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Loading profile...</p>
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6"
    >
      {/* Profile Header */}
      <motion.div variants={item} className="flex items-center gap-5 mb-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg shadow-brand-600/25">
          {profile.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {profile.username}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="badge bg-brand-700/20 text-brand-400">
              Level {profile.level || 1}
            </span>
            <span className="text-xs text-gray-500">
              {profile.xp?.toLocaleString() || 0} XP
            </span>
          </div>
        </div>
      </motion.div>

      {/* XP + Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Progression Card */}
        <motion.div variants={item} className="card-glass">
          <h3 className="hud-label mb-4">Progression</h3>
          <div className="flex items-end gap-3">
            <span className="font-display font-bold text-6xl text-white leading-none">
              {profile.level || 1}
            </span>
            <span className="text-brand-400 font-label text-sm font-semibold mb-2 px-2.5 py-0.5 rounded-lg bg-brand-600/10 border border-brand-500/15">
              LEVEL
            </span>
          </div>
          <XPProgressBar xp={profile.xp || 0} level={profile.level || 1} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Wins", value: stats.wins, icon: "🏆" },
            { label: "Win Rate", value: `${stats.winRate}%`, color: "text-accent-green", icon: "📊" },
            { label: "Matches", value: stats.wins + stats.losses, icon: "⚔️" },
            { label: "Streak", value: stats.streak, icon: "🔥" },
          ].map((stat, i) => (
            <div key={i} className="card-glass p-5 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className={`font-display font-bold text-3xl ${stat.color || "text-white"}`}>
                {loading ? "..." : stat.value}
              </p>
              <p className="hud-label mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div variants={item} className="card-glass">
        <h2 className="font-display font-bold text-xl mb-5">Earned Badges</h2>
        {profile.badges?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((b) => (
              <motion.div
                key={b}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-dark-400 rounded-xl ghost-border group hover:border-brand-500/20 transition-all cursor-default"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {BADGE_MAP[b]?.emoji || "🏅"}
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {BADGE_MAP[b]?.label || b}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Play matches and win to earn badges. Your first victory awaits! ⚔️
          </p>
        )}
      </motion.div>

      {/* Match History */}
      <motion.div variants={item} className="card-glass">
        <h2 className="font-display font-bold text-xl mb-5">Recent Matches</h2>
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-600 text-sm">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-3">⚔️</p>
              <p className="text-gray-500 text-sm">No matches yet. Enter the arena!</p>
            </div>
          ) : (
            history.map((match) => {
              const isWinner = match.winner_id === profile.id;
              return (
                <motion.div
                  key={match.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-dark-400 rounded-xl ghost-border hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${isWinner ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "grayscale opacity-60"}`}>
                      {isWinner ? "🏆" : "💀"}
                    </span>
                    <div>
                      <p className="font-medium text-white text-sm">
                        {isWinner ? "Victory" : "Defeat"}
                      </p>
                      <p className="text-xs text-gray-600 font-label">
                        {new Date(match.created_at).toLocaleDateString()} · {match.mode}
                      </p>
                    </div>
                  </div>
                  <span className={`font-display font-bold text-sm ${isWinner ? "text-accent-green" : "text-gray-500"}`}>
                    {isWinner ? "+100" : "+40"} XP
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
