"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal – accessible dialog with backdrop blur and spring animation.
 *
 * isOpen      – controls visibility
 * onClose     – called when backdrop or Esc key is pressed
 * title       – optional header text
 * size        – "sm" | "md" | "lg"
 */
const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) {
  // Close on Escape key
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className={[
              "relative w-full card-glass p-7",
              SIZES[size] ?? SIZES.md,
              className,
            ].join(" ")}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all text-xl leading-none"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
