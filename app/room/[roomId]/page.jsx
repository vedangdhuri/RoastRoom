"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentRoom } from "../../hooks/useRoom";
import { useChat } from "../../hooks/useChat";
import { useScoring } from "../../hooks/useScoring";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatInput from "../../components/chat/ChatInput";
import TurnTimer from "../../components/game/TurnTimer";
import ScoreCard from "../../components/game/ScoreCard";
import RoundTracker from "../../components/game/RoundTracker";
import WinnerAnnouncement from "../../components/game/WinnerAnnouncement";
import ParticipantList from "../../components/room/ParticipantList";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   Turn timer countdown hook
───────────────────────────────────────────── */
function useTimer(isActive, maxSeconds, onExpire) {
  const [seconds, setSeconds] = useState(maxSeconds);

  useEffect(() => {
    setSeconds(maxSeconds); // reset on maxSeconds change
  }, [maxSeconds]);

  useEffect(() => {
    if (!isActive) return;
    if (seconds <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, seconds]);

  return { seconds, reset: () => setSeconds(maxSeconds) };
}

/* ─────────────────────────────────────────────
   Main Battle Room
───────────────────────────────────────────── */
function BattleRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId;

  const { user, profile } = useAuth();
  const {
    room,
    players,
    spectators,
    mode,
    status,
    currentRound,
    currentTurn,
    topic,
    isFull,
    updateRoomStatus,
    setCurrentTurn,
    advanceRound,
  } = useCurrentRoom(roomId);

  const { messages, typingUsers, send, notifyTyping, stopTyping, updateScorePreview } =
    useChat(roomId);

  const { scoring, latestScore, submitForScoring, cumulativeScore } = useScoring({
    matchId: roomId,
    userId: user?.id,
    mode,
  });

  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const isDebate = mode === "debate";
  // In debate mode the player whose turn it is can send; roast is always open
  const isMyTurn = !isDebate || currentTurn === user?.id;
  const maxTurnSeconds = isDebate ? 90 : 60;
  const isActive = status === "active";

  const { seconds, reset: resetTimer } = useTimer(
    isActive && isDebate && isMyTurn,
    maxTurnSeconds,
    () => {
      // Turn expired – switch to opponent
      if (isDebate && isFull) {
        const opponent = players.find((p) => p.user_id !== user?.id);
        if (opponent) setCurrentTurn(roomId, opponent.user_id);
        resetTimer();
      }
    }
  );

  /* ── Send message + trigger AI scoring ── */
  const handleSend = async (text) => {
    stopTyping();
    await send(text, currentRound);

    const result = await submitForScoring(text, currentRound);

    if (result) {
      toast.success(`Scored ${result.total.toFixed(1)}/10 ✨`);

      // Attach score preview to the last message in Firestore
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.id) {
        updateScorePreview(roomId, lastMsg.id, result.total);
      }

      // In debate mode, hand off turn after scoring
      if (isDebate && isFull) {
        const opponent = players.find((p) => p.user_id !== user?.id);
        if (opponent) {
          await setCurrentTurn(roomId, opponent.user_id);
          resetTimer();
        }

        // After round 3 both players scored → show winner
        if (currentRound >= 3) {
          const winnerPlayer = players.reduce((best, p) =>
            (cumulativeScore > 0 ? user?.id : p.user_id) === user?.id ? p : best
          );
          setWinner(winnerPlayer?.users ?? { username: "Champion" });
          setFinalScore(result);
          setShowWinner(true);
          await updateRoomStatus(roomId, "finished");
        } else if (currentTurn !== user?.id) {
          await advanceRound(roomId);
        }
      }
    }
  };

  /* ── Room status header ── */
  const headerAccent = isDebate
    ? "bg-accent-blue/[0.03] border-b border-accent-blue/[0.08]"
    : "bg-accent-orange/[0.03] border-b border-accent-orange/[0.08]";

  if (!room) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading battle room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ══ MAIN COLUMN ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Room header bar */}
        <div className={`px-5 py-3 flex items-center justify-between shrink-0 ${headerAccent}`}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">{isDebate ? "⚔️" : "🔥"}</span>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-base text-white truncate">
                {topic}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={isDebate ? "debate" : "roast"}>{mode}</Badge>
                <Badge variant={isActive ? "live" : "waiting"} dot={isActive}>
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Roast mode: inline countdown */}
          {!isDebate && isActive && (
            <div className="shrink-0">
              <span className={`font-mono font-bold text-2xl ${seconds <= 10 ? "text-accent-red animate-pulse" : "text-accent-orange"}`}>
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Admin: start room when 2 players present */}
          {status === "waiting" && room?.created_by === user?.id && isFull && (
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                await updateRoomStatus(roomId, "active");
                const first = players[0];
                if (first) await setCurrentTurn(roomId, first.user_id);
              }}
            >
              Start Battle ⚔️
            </Button>
          )}
        </div>

        {/* Chat messages */}
        <ChatWindow
          messages={messages}
          typingUsers={typingUsers}
          currentUserId={user?.id}
          mode={mode}
        />

        {/* Chat input */}
        <div className="shrink-0 border-t border-white/[0.04] bg-dark-500/60">
          <ChatInput
            onSend={handleSend}
            onTyping={notifyTyping}
            disabled={!isActive || (!isMyTurn && isDebate)}
            disabledLabel={
              !isActive
                ? "Waiting for battle to start..."
                : "Waiting for opponent's turn..."
            }
            mode={mode}
            loading={scoring}
          />
          <p className="text-right text-[10px] text-gray-600 px-4 pb-2">
            Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* ══ SIDEBAR HUD ══════════════════════════════════════════ */}
      <div className="w-72 shrink-0 border-l border-white/[0.04] bg-surface-500 flex flex-col overflow-y-auto scrollbar-hide">
        {/* Debate timer */}
        {isDebate && isActive && (
          <div className="p-5 border-b border-white/[0.04] text-center">
            <TurnTimer seconds={seconds} maxSeconds={maxTurnSeconds} mode={mode} />
            <p className="text-xs text-gray-500 mt-2 font-label">
              {isMyTurn ? "🟢 Your turn" : "⏳ Opponent's turn"}
            </p>
          </div>
        )}

        {/* Round tracker */}
        <div className="p-5 border-b border-white/[0.04] text-center">
          <RoundTracker current={currentRound} total={3} mode={mode} />
        </div>

        {/* Participants */}
        <div className="p-5 border-b border-white/[0.04]">
          <ParticipantList
            players={players}
            spectators={spectators}
            currentTurnUserId={currentTurn}
            mode={mode}
          />
        </div>

        {/* My latest score */}
        {latestScore(currentRound) && (
          <div className="p-5">
            <p className="hud-label mb-3">Your Score – R{currentRound}</p>
            <ScoreCard score={latestScore(currentRound)} />
            {currentRound > 1 && (
              <p className="text-xs text-gray-500 mt-3 text-center font-label">
                Cumulative: {cumulativeScore.toFixed(1)} pts
              </p>
            )}
          </div>
        )}
      </div>

      {/* Winner overlay */}
      <WinnerAnnouncement
        isOpen={showWinner}
        winner={winner}
        scores={finalScore}
        onClose={() => {
          setShowWinner(false);
          router.push("/lobby");
        }}
      />
    </div>
  );
}

/* Wrap in ProtectedRoute so unauthenticated users are redirected */
export default function BattleRoomPage() {
  return (
    <ProtectedRoute>
      <BattleRoom />
    </ProtectedRoute>
  );
}
