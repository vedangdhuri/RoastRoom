"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * TypingIndicator – animated dots showing who is currently typing.
 * typingUsers: { [userId]: { username: string } }
 */
export default function TypingIndicator({ typingUsers = {} }) {
  const names = Object.values(typingUsers).map((u) => u.username ?? "Someone");
  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <AnimatePresence>
      <motion.div
        key="typing"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 px-4 py-1 text-xs text-gray-500"
      >
        {/* Three bouncing dots */}
        <span className="flex gap-1 items-center">
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span>{label}...</span>
      </motion.div>
    </AnimatePresence>
  );
}
