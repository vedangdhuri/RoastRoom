"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "../socket/socket";

/**
 * Spectator voting panel — appears at end of match for spectators to
 * cast their vote on who they think won the argument.
 */
export default function AudienceVoting({
  roomId,
  players,
  currentRound,
  isSpectator,
}) {
  const [votedFor, setVotedFor] = useState(null);
  const [voteTally, setVoteTally] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const socket = getSocket();

  useEffect(() => {
    const handleVoteUpdate = ({
      round,
      voteTally: tally,
      totalVotes: total,
    }) => {
      if (round === currentRound) {
        setVoteTally(tally);
        setTotalVotes(total);
      }
    };

    socket.on("crowd-vote-update", handleVoteUpdate);
    return () => socket.off("crowd-vote-update", handleVoteUpdate);
  }, [socket, currentRound]);

  // Reset vote state when round changes
  useEffect(() => {
    setVotedFor(null);
  }, [currentRound]);

  const castVote = (playerId) => {
    if (votedFor || !isSpectator) return;
    setVotedFor(playerId);
    socket.emit("spectator-vote", { roomId, votedForId: playerId });
  };

  if (!isSpectator || !players || players.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <span className="text-base">🗳️</span> Audience Vote
      </h4>

      <div className="space-y-2">
        {players.map((p) => {
          const playerId = p.userId?.toString();
          const votes = voteTally[playerId] || 0;
          const pct =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = votedFor === playerId;

          return (
            <motion.button
              key={playerId}
              onClick={() => castVote(playerId)}
              disabled={!!votedFor}
              whileHover={!votedFor ? { scale: 1.02 } : {}}
              whileTap={!votedFor ? { scale: 0.98 } : {}}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-brand-600/20 border-2 border-brand-500"
                  : votedFor
                    ? "bg-dark-200 opacity-60 border-2 border-transparent"
                    : "bg-dark-200 hover:bg-surface-100 border-2 border-transparent hover:border-white/10 cursor-pointer"
              }`}
            >
              {/* Progress bar background */}
              {votedFor && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-brand-600/10 rounded-xl"
                />
              )}

              <div className="w-8 h-8 rounded-full bg-brand-600/70 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10">
                {p.username?.[0]?.toUpperCase()}
              </div>
              <span className="flex-1 text-sm font-medium text-left z-10">
                {p.username}
              </span>
              {votedFor && (
                <span className="text-xs font-semibold text-brand-400 z-10">
                  {votes} vote{votes !== 1 ? "s" : ""} ({pct}%)
                </span>
              )}
              {isSelected && <span className="text-sm z-10">✅</span>}
            </motion.button>
          );
        })}
      </div>

      {!votedFor && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Tap a player to cast your vote
        </p>
      )}
    </motion.div>
  );
}
