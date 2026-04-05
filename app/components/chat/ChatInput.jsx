"use client";

import { useState, useRef, useCallback } from "react";
import Button from "../ui/Button";

/**
 * ChatInput – message compose bar.
 *
 * onSend(text)      – called with trimmed text when user submits
 * onTyping()        – called on every keystroke (for typing indicator)
 * disabled          – blocks input (e.g. not your turn in Debate)
 * disabledLabel     – hint text shown when disabled
 * mode              – "debate" | "roast" for accent colour
 * loading           – true while AI scoring in progress
 */
export default function ChatInput({
  onSend,
  onTyping,
  disabled = false,
  disabledLabel = "Waiting for your turn...",
  mode = "debate",
  loading = false,
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const isDebate = mode === "debate";

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || loading) return;
    setText("");
    onSend?.(trimmed);
    textareaRef.current?.focus();
  }, [text, disabled, loading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (disabled) {
    return (
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-gray-500 font-label">⏳ {disabledLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 p-4">
      <textarea
        ref={textareaRef}
        id="chat-input"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping?.();
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          isDebate
            ? "Craft your argument... (Enter to send)"
            : "Drop your roast... 🔥 (Enter to send)"
        }
        rows={2}
        maxLength={500}
        className="input flex-1 resize-none"
      />

      <Button
        id="send-message"
        variant={isDebate ? "primary" : "secondary"}
        size="md"
        onClick={handleSubmit}
        loading={loading}
        disabled={!text.trim()}
        className="shrink-0 self-end"
      >
        {loading ? "Scoring..." : isDebate ? "Submit ⚔️" : "Send 🔥"}
      </Button>
    </div>
  );
}
