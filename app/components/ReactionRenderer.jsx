"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "../socket/socket";

const EMOJI_MAP = {
  fire: "🔥",
  laugh: "😂",
  skull: "💀",
  tomato: "🍅",
};

const RANDOM_EMOJIS = [
  "🍔",
  "🎉",
  "🚀",
  "💯",
  "💩",
  "🤯",
  "🥶",
  "🤡",
  "👽",
  "👀",
  "💖",
  "🤔",
  "😎",
  "👻",
];

/**
 * Renders floating emoji reactions that animate upward and fade out.
 * Listens to `reaction-broadcast` socket events.
 */
export default function ReactionRenderer({ roomId }) {
  const [reactions, setReactions] = useState([]);
  const socket = getSocket();

  useEffect(() => {
    const handleReaction = ({ type, username }) => {
      const id = `${Date.now()}-${Math.random()}`;
      // If the type is not in EMOJI_MAP, it assumes 'type' is the emoji string itself.
      const emoji = EMOJI_MAP[type] || type || "🔥";

      // Random horizontal position between 5% and 95%
      const x = Math.random() * 90 + 5;

      setReactions((prev) => [...prev.slice(-30), { id, emoji, x, username }]);

      // Auto-remove after animation completes
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2500);
    };

    socket.on("reaction-broadcast", handleReaction);
    return () => socket.off("reaction-broadcast", handleReaction);
  }, [socket]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, y: "100vh", scale: 0.6 }}
            animate={{ opacity: 0, y: "-10vh", scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute text-4xl"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Reaction bar that spectators click to send reactions.
 */
export function ReactionBar({ roomId, disabled = false }) {
  const socket = getSocket();

  const sendReaction = useCallback(
    (type) => {
      if (disabled) return;
      socket.emit("spectator-reaction", { roomId, type });
    },
    [roomId, socket, disabled],
  );

  const sendRandomReaction = useCallback(() => {
    if (disabled) return;
    const randomEmoji =
      RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    socket.emit("spectator-reaction", { roomId, type: randomEmoji });
  }, [roomId, socket, disabled]);

  const buttons = [
    { type: "fire", emoji: "🔥", label: "Fire" },
    { type: "laugh", emoji: "😂", label: "LOL" },
    { type: "skull", emoji: "💀", label: "Dead" },
    { type: "tomato", emoji: "🍅", label: "Boo" },
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-dark-200/80 backdrop-blur-md rounded-2xl border border-white/10">
      <span className="text-xs text-gray-500 mr-1 uppercase tracking-wider font-semibold">
        React
      </span>
      {buttons.map((b) => (
        <motion.button
          key={b.type}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => sendReaction(b.type)}
          disabled={disabled}
          className="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title={b.label}
        >
          {b.emoji}
        </motion.button>
      ))}
      <div className="w-px h-6 bg-white/10 mx-1"></div>
      <motion.button
        whileHover={{ scale: 1.25 }}
        whileTap={{ scale: 0.85 }}
        onClick={sendRandomReaction}
        disabled={disabled}
        className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 hover:bg-brand-500/30 flex items-center justify-center text-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Random Emoji"
      >
        🎲
      </motion.button>
    </div>
  );
}
