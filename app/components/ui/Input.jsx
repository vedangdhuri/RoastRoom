"use client";

import { forwardRef } from "react";

/**
 * Input – unified text input / textarea primitive.
 *
 * multiline: renders a <textarea> instead of <input>
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    error,
    hint,
    multiline = false,
    rows = 3,
    className = "",
    containerClass = "",
    ...rest
  },
  ref
) {
  const Tag = multiline ? "textarea" : "input";

  return (
    <div className={`w-full ${containerClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="hud-label block mb-1.5"
        >
          {label}
        </label>
      )}

      <Tag
        ref={ref}
        id={id}
        rows={multiline ? rows : undefined}
        className={[
          "w-full bg-dark-100 rounded-xl px-4 py-3 text-sm text-gray-100",
          "placeholder-gray-600 font-sans",
          "focus:outline-none focus:bg-surface-100",
          "focus:shadow-[0_2px_0_0_theme(colors.brand.600)]",
          "transition-all duration-200 resize-none",
          error ? "shadow-[0_2px_0_0_theme(colors.accent.red)]" : "",
          className,
        ].join(" ")}
        {...rest}
      />

      {error && (
        <p className="mt-1.5 text-xs text-accent-red">{error}</p>
      )}
      {!error && hint && (
        <p className="mt-1.5 text-xs text-gray-600">{hint}</p>
      )}
    </div>
  );
});

export default Input;
