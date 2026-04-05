"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";
import RoomCard from "../components/room/RoomCard";
import CreateRoomModal from "../components/room/CreateRoomModal";
import Button from "../components/ui/Button";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const MODES = ["all", "debate", "roast"];
const STATUSES = ["all", "waiting", "active", "finished"];

export default function LobbyPage() {
  const { rooms, loading, filter, setFilter, refresh } = useRoom();
  const { isAuthenticated } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
            Battle Lobby
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            className="text-gray-500"
          >
            ↻ Refresh
          </Button>
          {isAuthenticated && (
            <Button
              id="create-room-btn"
              variant="primary"
              size="md"
              onClick={() => setShowCreate(true)}
            >
              + Create Room
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Mode filter */}
        <div className="flex items-center gap-1 p-1 bg-dark-400 rounded-xl">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setFilter({ mode: m })}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-label font-semibold uppercase tracking-wider transition-all",
                filter.mode === m
                  ? m === "debate"
                    ? "bg-accent-blue/15 text-accent-blue"
                    : m === "roast"
                    ? "bg-accent-orange/15 text-accent-orange"
                    : "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300",
              ].join(" ")}
            >
              {m === "debate" ? "⚔️ " : m === "roast" ? "🔥 " : ""}
              {m}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 p-1 bg-dark-400 rounded-xl">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter({ status: s })}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-label font-semibold uppercase tracking-wider transition-all",
                filter.status === s
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏟️</p>
          <p className="font-display font-bold text-xl text-gray-500">
            No rooms found
          </p>
          <p className="text-gray-600 text-sm mt-2">
            {isAuthenticated
              ? "Create the first battle room and wait for a challenger!"
              : "Sign in to create a room."}
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={item}>
              <RoomCard room={room} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <CreateRoomModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
