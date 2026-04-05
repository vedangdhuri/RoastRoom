"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ModeSelector from "./ModeSelector";
import { useRoom } from "../../hooks/useRoom";
import toast from "react-hot-toast";

const DEBATE_TOPICS = [
  "Should AI have legal rights?",
  "Is remote work better than office work?",
  "Should social media be regulated by governments?",
  "Is college education still worth it in 2025?",
  "Should voting be mandatory?",
];

const ROAST_TOPICS = [
  "Your code is spaghetti and you know it",
  "Your startup is just a landing page with delusions",
  "You peaked in high school",
  "Your taste in music needs a patch update",
  "Your LinkedIn posts make recruiters cringe",
];

export default function CreateRoomModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("debate");
  const [topic, setTopic] = useState("");
  const { createRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const suggestions = mode === "debate" ? DEBATE_TOPICS : ROAST_TOPICS;

  const handleCreate = async () => {
    if (!topic.trim()) return toast.error("Enter a battle topic");
    setLoading(true);
    try {
      const room = await createRoom(mode, topic.trim());
      toast.success(`${mode === "debate" ? "⚔️" : "🔥"} Room created!`);
      onClose();
      router.push(`/room/${room.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTopic("");
    setMode("debate");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Battle Room" size="md">
      <div className="space-y-5">
        {/* Mode picker */}
        <div>
          <p className="hud-label mb-2">Battle Mode</p>
          <ModeSelector value={mode} onChange={setMode} />
        </div>

        {/* Topic input */}
        <Input
          id="room-topic"
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={
            mode === "debate"
              ? "Enter a debate topic..."
              : "Enter a roast target..."
          }
        />

        {/* Suggestions */}
        <div>
          <p className="hud-label mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className={[
                  "text-xs px-3 py-1.5 rounded-lg transition-all",
                  topic === s
                    ? mode === "debate"
                      ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                      : "bg-accent-orange/15 text-accent-orange border border-accent-orange/20"
                    : "bg-dark-400 text-gray-500 hover:text-gray-300 ghost-border",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="ghost" size="md" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            id="create-room-submit"
            variant={mode === "debate" ? "primary" : "secondary"}
            size="md"
            loading={loading}
            onClick={handleCreate}
            disabled={!topic.trim()}
            className="flex-1"
          >
            Launch {mode === "debate" ? "⚔️" : "🔥"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
