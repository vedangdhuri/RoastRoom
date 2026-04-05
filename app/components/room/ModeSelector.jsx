"use client";

/**
 * ModeSelector – toggle between "debate" and "roast" modes.
 */
export default function ModeSelector({ value, onChange }) {
  const modes = [
    {
      id: "debate",
      icon: "⚔️",
      label: "Debate",
      desc: "Intellectual sparring",
      activeClass:
        "bg-accent-blue/10 border-2 border-accent-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
      checkColor: "bg-accent-blue",
    },
    {
      id: "roast",
      icon: "🔥",
      label: "Roast",
      desc: "Savage freefire",
      activeClass:
        "bg-accent-orange/10 border-2 border-accent-orange/40 shadow-[0_0_20px_rgba(253,118,26,0.1)]",
      checkColor: "bg-accent-orange",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {modes.map((m) => {
        const isSelected = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={[
              "relative p-5 rounded-xl text-left transition-all duration-300",
              isSelected
                ? m.activeClass
                : "bg-dark-400 border-2 border-transparent hover:border-white/[0.08]",
            ].join(" ")}
          >
            <span className="text-3xl block mb-2">{m.icon}</span>
            <p className="font-display font-bold text-white text-sm">
              {m.label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>

            {isSelected && (
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full ${m.checkColor} flex items-center justify-center`}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
