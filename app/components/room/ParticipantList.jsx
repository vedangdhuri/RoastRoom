"use client";

/**
 * ParticipantList – sidebar list of players and spectators in a room.
 */
export default function ParticipantList({
  players = [],
  spectators = [],
  currentTurnUserId,
  mode,
}) {
  const isDebate = mode === "debate";

  return (
    <div className="space-y-4">
      {/* Players */}
      <div>
        <p className="hud-label mb-2">⚔️ Combatants ({players.length}/2)</p>
        <div className="space-y-2">
          {players.map((p) => {
            const isCurrentTurn = p.user_id === currentTurnUserId;
            return (
              <div
                key={p.id}
                className={[
                  "flex items-center gap-3 p-3 rounded-xl transition-all",
                  isCurrentTurn && isDebate
                    ? "bg-accent-blue/10 ring-1 ring-accent-blue/30"
                    : "bg-dark-400",
                ].join(" ")}
              >
                {/* Avatar */}
                <div
                  className={[
                    "w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0",
                    isCurrentTurn && isDebate
                      ? "bg-accent-blue/20 text-accent-blue"
                      : "bg-surface-200 text-gray-400",
                  ].join(" ")}
                >
                  {p.users?.username?.[0]?.toUpperCase() ?? "?"}
                </div>

                {/* Name + level */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {p.users?.username ?? "Player"}
                  </p>
                  <p className="hud-label text-[10px]">
                    Lv.{p.users?.level ?? 1}
                  </p>
                </div>

                {/* Turn indicator */}
                {isCurrentTurn && isDebate && (
                  <span className="text-[10px] font-label text-accent-blue animate-pulse uppercase tracking-wider">
                    TURN
                  </span>
                )}
              </div>
            );
          })}

          {players.length === 0 && (
            <p className="text-xs text-gray-600 px-3">No players yet</p>
          )}
        </div>
      </div>

      {/* Spectators */}
      {spectators.length > 0 && (
        <div>
          <p className="hud-label mb-2">👁 Watching ({spectators.length})</p>
          <div className="flex flex-wrap gap-2">
            {spectators.map((s) => (
              <span
                key={s.id}
                className="text-xs text-gray-500 px-2 py-1 bg-dark-400 rounded-lg"
              >
                {s.users?.username ?? "Spectator"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
