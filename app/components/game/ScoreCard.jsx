"use client";

import { motion } from "framer-motion";

const CATEGORIES = [
  { key: "logic",      label: "Logic",      color: "bg-accent-blue" },
  { key: "creativity", label: "Creativity", color: "bg-brand-500" },
  { key: "clarity",    label: "Clarity",    color: "bg-accent-green" },
  { key: "humor",      label: "Humor",      color: "bg-accent-orange" },
];

/**
 * ScoreCard – animated breakdown of an AI score result.
 *
 * score    – { logic, creativity, clarity, humor, total, feedback }
 * reveal   – true = spring-scale entrance animation
 */
export default function ScoreCard({ score, reveal = false }) {
  if (!score) return null;

  return (
    <motion.div
      initial={reveal ? { scale: 0, opacity: 0, filter: "blur(10px)" } : false}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      className="card-glass p-4 space-y-3"
    >
      {/* Category bars */}
      {CATEGORIES.map(({ key, label, color }) => {
        const val = score[key] ?? 0;
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="hud-label text-[10px]">{label}</span>
              <span className="font-mono text-xs text-white font-bold">
                {val.toFixed(1)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-dark-400 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(val / 10) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                className={`h-full rounded-full ${color}`}
              />
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <span className="hud-label">Total</span>
        <span className="font-display font-bold text-xl text-white">
          {(score.total ?? 0).toFixed(1)}
          <span className="text-gray-500 text-xs font-normal">/10</span>
        </span>
      </div>

      {/* AI feedback */}
      {score.feedback && (
        <p className="text-xs text-gray-500 italic leading-relaxed">
          "{score.feedback}"
        </p>
      )}
    </motion.div>
  );
}
