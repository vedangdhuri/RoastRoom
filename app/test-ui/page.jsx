"use client";
import { useEffect } from "react";
import { useRoomStore } from "../store/roomStore";
import { useGameStore } from "../store/gameStore";
import AudienceVoting from "../components/AudienceVoting";
import ReactionRenderer, { ReactionBar } from "../components/ReactionRenderer";
import HighlightExport from "../components/HighlightExport";

export default function TestUIPage() {
  const { setIsSpectator, setPlayers } = useRoomStore();
  const { setGameStatus, setRound } = useGameStore();

  useEffect(() => {
    // Mock spectator in an active game
    setIsSpectator(true);
    setPlayers([
      { userId: "1", username: "Alice" },
      { userId: "2", username: "Bob" },
    ]);
    setGameStatus("active");
    setRound({ round: 1, maxRounds: 3, currentTurn: "1" });
  }, [setIsSpectator, setPlayers, setGameStatus, setRound]);

  const mockMatchResult = {
    winner: { userId: "1", username: "Alice" },
    finalScores: [
      { userId: "1", username: "Alice", totalScore: 30, xpEarned: 100 },
      { userId: "2", username: "Bob", totalScore: 10, xpEarned: 20 },
    ],
    peoplesChamp: true,
    crowdWinner: { username: "Bob" },
  };

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-2xl font-bold">E2E Mock Testing Page</h1>

      <div id="test-audience-voting">
        <AudienceVoting
          roomId="test-room"
          players={[
            { userId: "1", username: "Alice" },
            { userId: "2", username: "Bob" },
          ]}
          currentRound={1}
          isSpectator={true}
        />
      </div>

      <div
        id="test-reaction-bar"
        className="relative p-10 bg-black/50 border h-[300px]"
      >
        <h2 className="mb-4">Reaction Bar</h2>
        <ReactionBar roomId="test-room" disabled={false} />
      </div>

      <div id="test-highlight-export">
        <HighlightExport
          matchResult={mockMatchResult}
          topic="Pineapple on Pizza"
          mode="debate"
        />
      </div>

      <ReactionRenderer roomId="test-room" />
    </div>
  );
}
