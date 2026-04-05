"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

/**
 * Button – unified button primitive.
 *
 * variant: "primary" | "secondary" | "ghost" | "outline" | "danger"
 * size:    "sm" | "md" | "lg"
 */
const VARIANTS = {
  primary:
    "bg-gradient-to-r from-brand-400 to-brand-500 text-white hover:shadow-[0_0_24px_rgba(138,76,252,0.4)]",
  secondary:
    "bg-accent-orange text-white hover:shadow-[0_0_24px_rgba(253,118,26,0.4)]",
  ghost:
    "bg-transparent text-gray-400 hover:text-gray-100 hover:bg-white/5",
  outline:
    "bg-transparent border border-brand-600/40 text-brand-400 hover:bg-brand-700/10 hover:border-brand-500/60",
  danger:
    "bg-accent-red/10 border border-accent-red/30 text-accent-red hover:bg-accent-red/20",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-xl",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    onClick,
    type = "button",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-display font-semibold",
        "transition-all duration-200 ease-out select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            className="opacity-75"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
});

export default Button;
