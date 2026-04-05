"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import ScoreCard from "./ScoreCard";
import { useRouter } from "next/navigation";

/**
 * WinnerAnnouncement – full-screen overlay revealed when a match ends.
 *
 * winner  – { username } object of the winner
 * scores  – optional final ScoreCard data { logic, creativity, clarity, humor, total, feedback }
 * isOpen  – controls visibility
 * onClose – callback when dismissed
 */
export default function WinnerAnnouncement({ winner, scores, isOpen, onClose }) {
  const router = useRouter();

  // Confetti CSS keyframe is defined in globals.css via @keyframes float
  // For a lightweight effect we animate a few emoji dots
  const confettiItems = ["🎉", "⭐", "🔥", "💥", "✨", "🏆"];

  const handleClose = () => {
    onClose?.();
    router.push("/lobby");
  };

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="winner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          {/* Floating confetti items */}
          {confettiItems.map((item, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, x: (i - 3) * 60 }}
              animate={{ opacity: [0, 1, 0], y: -120, scale: [0.5, 1.2, 0.8] }}
              transition={{ delay: 0.3 + i * 0.12, duration: 1.8, ease: "easeOut" }}
              className="absolute text-3xl pointer-events-none select-none"
              style={{ left: `${(i / confettiItems.length) * 100}%`, bottom: "20%" }}
            >
              {item}
            </motion.span>
          ))}

          {/* Card */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
            className="relative z-10 text-center max-w-sm mx-4 w-full"
          >
            {/* Trophy */}
            <motion.div
              initial={{ y: -20, rotate: -10 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
              className="text-7xl mb-4"
            >
              🏆
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display font-bold text-4xl text-gradient mb-2"
            >
              CHAMPION
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="font-display font-bold text-2xl text-white mb-6"
            >
              {winner?.username ?? "Player"}
            </motion.p>

            {/* Final score breakdown */}
            {scores && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <ScoreCard score={scores} reveal />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-3"
            >
              <Button
                variant="outline"
                size="md"
                onClick={handleClose}
                className="flex-1"
              >
                Back to Lobby
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleClose}
                className="flex-1"
              >
                Play Again ⚔️
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
