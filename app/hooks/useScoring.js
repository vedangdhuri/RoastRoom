"use client";

import { useState, useCallback } from "react";
import { scoreMessage } from "../lib/api";

/**
 * useScoring – manages AI scoring state for a single player in a room.
 *
 * Tracks per-round scores and exposes helpers for submitting and reading them.
 */
export function useScoring({ matchId, userId, mode }) {
  // { [round]: ScoreResult }
  const [scoresByRound, setScoresByRound] = useState({});
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submit a message for AI scoring.
   * Returns the score result or null on failure.
   */
  const submitForScoring = useCallback(
    async (message, round) => {
      if (!matchId || !userId || !message?.trim()) return null;

      setScoring(true);
      setError(null);

      try {
        const result = await scoreMessage({
          message: message.trim(),
          mode,
          matchId,
          userId,
          round,
        });

        setScoresByRound((prev) => ({ ...prev, [round]: result }));
        return result;
      } catch (err) {
        const msg = err.response?.data?.error ?? err.message ?? "Scoring failed";
        setError(msg);
        return null;
      } finally {
        setScoring(false);
      }
    },
    [matchId, userId, mode]
  );

  /**
   * Cumulative total across all scored rounds.
   */
  const cumulativeScore = Object.values(scoresByRound).reduce(
    (sum, r) => sum + (r?.total ?? 0),
    0
  );

  /**
   * Latest round's score result (or null).
   */
  const latestScore = (round) => scoresByRound[round] ?? null;

  const clearScores = useCallback(() => setScoresByRound({}), []);

  return {
    scoring,
    error,
    scoresByRound,
    cumulativeScore,
    latestScore,
    submitForScoring,
    clearScores,
  };
}
