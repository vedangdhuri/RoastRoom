"use client";

import { useEffect, useCallback } from "react";
import { useRoomStore } from "../store/roomStore";
import { useAuthStore } from "../store/authStore";

/**
 * useRoom – hook for room list / lobby interactions.
 */
export function useRoom() {
  const {
    rooms,
    loading,
    error,
    filter,
    fetchRooms,
    createRoom,
    joinRoom,
    setFilter,
  } = useRoomStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms, filter]);

  const create = useCallback(
    async (mode, topic) => {
      if (!user) throw new Error("Must be logged in to create a room");
      return createRoom(mode, topic);
    },
    [user, createRoom]
  );

  const join = useCallback(
    async (roomId, role = "player") => {
      if (!user) throw new Error("Must be logged in to join a room");
      return joinRoom(roomId, role);
    },
    [user, joinRoom]
  );

  // Filter helpers
  const waitingRooms = rooms.filter((r) => r.status === "waiting");
  const activeRooms = rooms.filter((r) => r.status === "active");
  const debateRooms = rooms.filter((r) => r.mode === "debate");
  const roastRooms = rooms.filter((r) => r.mode === "roast");

  return {
    rooms,
    waitingRooms,
    activeRooms,
    debateRooms,
    roastRooms,
    loading,
    error,
    filter,
    setFilter,
    createRoom: create,
    joinRoom: join,
    refresh: fetchRooms,
  };
}

/**
 * useCurrentRoom – hook for the active battle room.
 */
export function useCurrentRoom(roomId) {
  const {
    currentRoom,
    participants,
    loading,
    error,
    fetchRoom,
    updateRoomStatus,
    setCurrentTurn,
    advanceRound,
    clearCurrentRoom,
  } = useRoomStore();

  useEffect(() => {
    if (roomId) fetchRoom(roomId);
    return () => clearCurrentRoom();
  }, [roomId]);

  const mode = currentRoom?.mode ?? "debate";
  const status = currentRoom?.status ?? "waiting";
  const currentRound = currentRoom?.current_round ?? 1;
  const currentTurn = currentRoom?.current_turn;
  const topic = currentRoom?.topic ?? "";

  const players = participants.filter((p) => p.role === "player");
  const spectators = participants.filter((p) => p.role === "spectator");
  const isFull = players.length >= 2;

  return {
    room: currentRoom,
    participants,
    players,
    spectators,
    mode,
    status,
    currentRound,
    currentTurn,
    topic,
    isFull,
    loading,
    error,
    updateRoomStatus,
    setCurrentTurn,
    advanceRound,
  };
}
