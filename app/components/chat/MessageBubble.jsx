"use client";

import { motion } from "framer-motion";

/**
 * MessageBubble – a single chat message with sender alignment and score badge.
 *
 * isOwn  – aligns right and applies mode accent
 * mode   – "debate" | "roast" for colour theming
 */
export default function MessageBubble({ message, isOwn, mode }) {
  const isDebate = mode === "debate";
  const hasHighScore = (message.scorePreview?.total ?? 0) >= 8;

  return (
    <motion.div
      initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2 mb-3 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar (opponent side only) */}
      {!isOwn && (
        <div className="w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center text-xs font-display font-bold text-gray-400 shrink-0">
          {message.username?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="max-w-[72%]">
        {/* Sender name (opponent only) */}
        {!isOwn && (
          <p className="text-[10px] font-label text-gray-500 mb-1 ml-0.5">
            {message.username}
          </p>
        )}

        <div
          className={[
            "relative rounded-2xl px-4 py-3",
            isOwn
              ? isDebate
                ? "bg-accent-blue/10 border border-accent-blue/15 rounded-br-sm"
                : "bg-accent-orange/10 border border-accent-orange/15 rounded-br-sm"
              : "bg-surface-300 ghost-border rounded-bl-sm",
            // Flame glow on high-score roast messages
            hasHighScore && !isDebate
              ? "shadow-[0_0_16px_rgba(253,118,26,0.2)]"
              : "",
          ].join(" ")}
        >
          <p className="text-sm text-gray-200 leading-relaxed">{message.text}</p>

          {/* Score preview */}
          {message.scorePreview?.total != null && (
            <div
              className={[
                "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-mono font-bold",
                hasHighScore
                  ? isDebate
                    ? "bg-accent-blue/15 text-accent-blue"
                    : "bg-accent-orange/15 text-accent-orange"
                  : "bg-white/[0.06] text-gray-400",
              ].join(" ")}
            >
              {hasHighScore && !isDebate && "🔥 "}
              {message.scorePreview.total.toFixed(1)}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <p className={`text-[10px] text-gray-600 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
            {new Date(message.timestamp?.toDate?.() ?? message.timestamp).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}
