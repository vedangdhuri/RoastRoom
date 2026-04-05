"use client";

/**
 * RoundTracker – displays Round X of Y with active dot indicators.
 *
 * current   – current round (1-indexed)
 * total     – total rounds (default 3)
 * mode      – for accent colour
 */
export default function RoundTracker({ current = 1, total = 3, mode = "debate" }) {
  const isDebate = mode === "debate";

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="hud-label">Round</p>
      <div className="flex items-center gap-3">
        {/* Big round number */}
        <span className="font-display font-bold text-4xl text-white leading-none">
          {current}
        </span>
        <span className="text-gray-600 font-mono text-sm">/ {total}</span>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 mt-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              i < current
                ? isDebate
                  ? "bg-accent-blue w-6"
                  : "bg-accent-orange w-6"
                : i === current - 1
                ? isDebate
                  ? "bg-accent-blue w-4"
                  : "bg-accent-orange w-4"
                : "bg-dark-400 w-4",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
