"use client";

import { motion } from "framer-motion";

/**
 * TurnTimer – animated circular SVG countdown.
 *
 * seconds    – remaining seconds
 * maxSeconds – total turn length (determines arc progress)
 * mode       – "debate" | "roast"
 */
export default function TurnTimer({ seconds, maxSeconds = 90, mode = "debate" }) {
  const progress = Math.max(seconds / maxSeconds, 0);
  const R = 44;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);
  const isLow = seconds <= 10;
  const isDebate = mode === "debate";

  // Colour: red when low, mode-accent otherwise
  const strokeColor = isLow ? "#ff6e84" : isDebate ? "#3b82f6" : "#fd761a";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-dark-400"
          />
          {/* Animated progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={[
              "font-mono font-bold text-3xl",
              isLow ? "text-accent-red animate-pulse" : "text-white",
            ].join(" ")}
          >
            {seconds}
          </span>
        </div>
      </div>

      <p className="hud-label">
        {isLow ? "⚠️ Time running out!" : "Time remaining"}
      </p>
    </div>
  );
}
