import { create } from "zustand";

export const useGameStore = create((set) => ({
  gameStatus: "idle", // idle | starting | active | scoring | finished
  currentRound: 0,
  maxRounds: 3,
  currentTurn: null, // userId
  timeLeft: 0,
  roundScores: [], // [{ userId, username, round, scores }]
  finalScores: [],
  winner: null,
  topic: "",
  mode: "debate",
  isScoring: false,
  matchResult: null,

  setGameStatus: (status) => set({ gameStatus: status }),

  initGame: ({ round, maxRounds, topic, mode, currentTurn }) =>
    set({
      gameStatus: "active",
      currentRound: round,
      maxRounds,
      topic,
      mode,
      currentTurn,
      roundScores: [],
      finalScores: [],
      winner: null,
      matchResult: null,
    }),

  setRound: ({ round, maxRounds, currentTurn }) =>
    set({ currentRound: round, maxRounds, currentTurn }),

  setTimeLeft: (timeLeft) => set({ timeLeft }),

  setCurrentTurn: (userId) => set({ currentTurn: userId }),

  addRoundScore: (scoreEntry) =>
    set((state) => ({
      roundScores: [...state.roundScores, scoreEntry],
    })),

  setIsScoring: (val) => set({ isScoring: val }),

  setMatchResult: ({ winner, finalScores }) =>
    set({
      winner,
      finalScores,
      gameStatus: "finished",
      matchResult: { winner, finalScores },
    }),

  resetGame: () =>
    set({
      gameStatus: "idle",
      currentRound: 0,
      maxRounds: 3,
      currentTurn: null,
      timeLeft: 0,
      roundScores: [],
      finalScores: [],
      winner: null,
      topic: "",
      mode: "debate",
      isScoring: false,
      matchResult: null,
    }),
}));
