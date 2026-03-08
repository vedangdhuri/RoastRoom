import { create } from "zustand";

export const useRoomStore = create((set) => ({
  currentRoom: null,
  rooms: [],
  messages: [],
  players: [],
  spectators: [],
  isSpectator: false,

  setCurrentRoom: (room) => set({ currentRoom: room }),

  setRooms: (rooms) => set({ rooms }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg].slice(-200), // keep last 200 messages
    })),

  clearMessages: () => set({ messages: [] }),

  setPlayers: (players) => set({ players }),

  addPlayer: (player) =>
    set((state) => ({
      players: state.players.some((p) => p.userId === player.userId)
        ? state.players
        : [...state.players, player],
    })),

  removePlayer: (username) =>
    set((state) => ({
      players: state.players.filter((p) => p.username !== username),
    })),

  setSpectators: (spectators) => set({ spectators }),

  setIsSpectator: (val) => set({ isSpectator: val }),

  clearRoom: () =>
    set({
      currentRoom: null,
      messages: [],
      players: [],
      spectators: [],
      isSpectator: false,
    }),
}));
