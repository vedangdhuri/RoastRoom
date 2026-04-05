"use client";

/**
 * Badge – status / mode / rank pill.
 *
 * variant: "debate" | "roast" | "live" | "waiting" | "finished" |
 *          "success" | "warning" | "default"
 */
const VARIANTS = {
  debate:   "bg-accent-blue/15 text-accent-blue",
  roast:    "bg-accent-orange/15 text-accent-orange",
  live:     "bg-accent-green/15 text-accent-green",
  waiting:  "bg-yellow-500/15 text-yellow-400",
  finished: "bg-gray-500/15 text-gray-400",
  success:  "bg-accent-green/15 text-accent-green",
  warning:  "bg-yellow-500/15 text-yellow-400",
  default:  "bg-white/[0.06] text-gray-400",
};

const STATUS_DOTS = { live: true, waiting: true };

export default function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
}) {
  const showDot = dot || STATUS_DOTS[variant];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full",
        "text-[11px] font-label font-semibold uppercase tracking-wider",
        VARIANTS[variant] ?? VARIANTS.default,
        className,
      ].join(" ")}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}
