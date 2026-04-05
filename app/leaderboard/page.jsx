"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const BADGE_MAP = {
  first_win: "🥇",
  five_wins: "⭐",
  ten_wins: "🏆",
  roast_king: "🔥",
  debate_legend: "🎓",
  high_scorer: "💯",
};

const PodiumCard = ({ entry, rank }) => {
  const colors = {
    1: { ring: "ring-yellow-400/40", bg: "bg-yellow-400/8", text: "text-yellow-400", glow: "shadow-[0_0_30px_rgba(250,204,21,0.12)]", emoji: "👑" },
    2: { ring: "ring-gray-400/40", bg: "bg-gray-400/8", text: "text-gray-300", glow: "shadow-[0_0_20px_rgba(156,163,175,0.08)]", emoji: "🥈" },
    3: { ring: "ring-orange-700/40", bg: "bg-orange-700/8", text: "text-orange-500", glow: "shadow-[0_0_20px_rgba(180,83,9,0.08)]", emoji: "🥉" },
  };
  const c = colors[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`card-glass ${c.bg} ${c.ring} ring-1 ${c.glow} text-center p-6 ${rank === 1 ? "order-first lg:scale-105" : ""}`}
    >
      <div className="text-3xl mb-3">{c.emoji}</div>
      <div className={`w-14 h-14 rounded-2xl ${c.bg} ring-2 ${c.ring} flex items-center justify-center font-display font-bold text-xl mx-auto mb-3 ${c.text}`}>
        {entry.username?.[0]?.toUpperCase()}
      </div>
      <p className="font-display font-bold text-white text-lg truncate">{entry.username}</p>
      <p className="hud-label mt-1">Lv.{entry.level || 1}</p>
      <div className={`font-display font-bold text-2xl mt-3 ${c.text}`}>
        {entry.wins || 0}
        <span className="text-xs text-gray-500 font-label ml-1">WINS</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{entry.xp?.toLocaleString() || 0} XP</p>
      {/* Badges */}
      <div className="flex justify-center gap-1 mt-3">
        {(entry.badges || []).slice(0, 3).map((b) => (
          <span key={b} title={b} className="text-lg">{BADGE_MAP[b] || "🏅"}</span>
        ))}
      </div>
    </motion.div>
  );
};

const LeaderRow = ({ entry, rank, isMe }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.03 }}
    whileHover={{ x: 4 }}
    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
      isMe
        ? "bg-brand-700/10 ring-1 ring-brand-500/20"
        : "ghost-border hover:bg-white/[0.03]"
    }`}
  >
    <span className="w-8 text-center font-mono text-sm text-gray-500">#{rank}</span>

    <div className="w-10 h-10 rounded-xl bg-surface-200 flex items-center justify-center font-display font-bold text-sm text-brand-400">
      {entry.username?.[0]?.toUpperCase()}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-white truncate">{entry.username}</p>
        {isMe && <span className="badge bg-brand-600/20 text-brand-400 text-[10px]">YOU</span>}
        <div className="flex gap-0.5">
          {(entry.badges || []).slice(0, 2).map((b) => (
            <span key={b} className="text-sm" title={b}>{BADGE_MAP[b] || ""}</span>
          ))}
        </div>
      </div>
      <p className="hud-label text-[10px] mt-0.5">
        Lv.{entry.level || 1} · {entry.wins || 0} wins
      </p>
    </div>

    <div className="text-right">
      <p className="font-mono font-bold text-brand-400 text-base">
        {entry.xp?.toLocaleString() || 0}
      </p>
      <p className="hud-label text-[10px]">XP</p>
    </div>
  </motion.div>
);

export default function LeaderboardPage() {
  const { user, profile } = useAuthStore();
  const [tab, setTab] = useState("all-time");
  const [modeFilter, setModeFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("users")
          .select("id, username, xp, level, wins, badges")
          .order("xp", { ascending: false })
          .limit(50);

        const { data: rows, error } = await query;
        if (error) throw error;
        setData(rows || []);
      } catch {
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [tab]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block text-5xl mb-4 animate-float">🏆</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-2">
          Global Leaderboard
        </h1>
        <p className="text-gray-500">The elite fighters of the arena</p>

        {/* Global stats */}
        <div className="flex justify-center gap-6 mt-6">
          {[
            { value: "2,847", label: "Active Players" },
            { value: "12K+", label: "Matches Played" },
            { value: "94%", label: "Top Win Rate" },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <p className="font-display font-bold text-xl text-white">{s.value}</p>
              <p className="hud-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <div className="flex p-1 bg-dark-400 rounded-xl gap-1">
          {["all-time", "this-week", "today"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-label font-semibold uppercase tracking-wider transition-all ${
                tab === t ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "all-time" ? "All Time" : t === "this-week" ? "This Week" : "Today"}
            </button>
          ))}
        </div>
        <div className="flex p-1 bg-dark-400 rounded-xl gap-1">
          {["all", "debate", "roast"].map((m) => (
            <button
              key={m}
              onClick={() => setModeFilter(m)}
              className={`px-4 py-2 rounded-lg text-xs font-label font-semibold uppercase tracking-wider transition-all ${
                modeFilter === m
                  ? m === "debate" ? "bg-accent-blue/15 text-accent-blue"
                    : m === "roast" ? "bg-accent-orange/15 text-accent-orange"
                    : "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "debate" ? "⚔️ " : m === "roast" ? "🔥 " : ""}{m}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading champions...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">👀</p>
          <p className="text-gray-500">No players ranked yet. Be the first!</p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {top3.map((entry, i) => (
                <PodiumCard key={entry.id} entry={entry} rank={i + 1} />
              ))}
            </div>
          )}

          {/* Rest of leaderboard */}
          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((entry, i) => (
                <LeaderRow
                  key={entry.id}
                  entry={entry}
                  rank={i + 4}
                  isMe={entry.id === profile?.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
