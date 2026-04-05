"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Badge from "../ui/Badge";

/**
 * RoomCard – displays a single room in the lobby grid.
 */
export default function RoomCard({ room }) {
  const router = useRouter();
  const isDebate = room.mode === "debate";
  const playerCount =
    room.room_participants?.filter((p) => p.role === "player").length ?? 0;
  const canJoin = playerCount < 2 && room.status === "waiting";

  const handleClick = () => router.push(`/room/${room.id}`);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className={[
        "card-glass relative overflow-hidden cursor-pointer group",
        "hover:bg-white/[0.05] transition-colors duration-300",
        isDebate
          ? "hover:border-accent-blue/20"
          : "hover:border-accent-orange/20",
      ].join(" ")}
    >
      {/* Mode accent top bar */}
      <div
        className={[
          "absolute top-0 left-0 right-0 h-0.5",
          isDebate
            ? "bg-gradient-to-r from-accent-blue to-brand-500"
            : "bg-gradient-to-r from-accent-orange to-accent-red",
        ].join(" ")}
      />

      <div className="flex items-start justify-between mb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <div
            className={[
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
              isDebate ? "bg-accent-blue/10" : "bg-accent-orange/10",
            ].join(" ")}
          >
            {isDebate ? "⚔️" : "🔥"}
          </div>
          <Badge variant={isDebate ? "debate" : "roast"}>{room.mode}</Badge>
        </div>
        <Badge
          variant={
            room.status === "active"
              ? "live"
              : room.status === "waiting"
              ? "waiting"
              : "finished"
          }
          dot={room.status === "active"}
        >
          {room.status}
        </Badge>
      </div>

      <h3 className="font-display font-bold text-base text-white mb-4 leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
        {room.topic}
      </h3>

      <div className="flex items-center justify-between">
        <span className="hud-label">{playerCount}/2 Players</span>
        <span
          className={[
            "text-xs font-semibold transition-colors",
            canJoin
              ? isDebate
                ? "text-accent-blue"
                : "text-accent-orange"
              : "text-gray-500",
          ].join(" ")}
        >
          {canJoin ? "Join →" : room.status === "active" ? "Watch →" : "Ended"}
        </span>
      </div>
    </motion.div>
  );
}
