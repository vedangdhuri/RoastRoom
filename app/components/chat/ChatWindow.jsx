"use client";

import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

/**
 * ChatWindow – scrollable message list.
 *
 * messages     – Firestore message array
 * typingUsers  – map of users currently typing (excluding self)
 * currentUserId – to align own messages to the right
 * mode         – "debate" | "roast"
 */
export default function ChatWindow({ messages = [], typingUsers = {}, currentUserId, mode }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-50">
          <span className="text-4xl">{mode === "roast" ? "🔥" : "⚔️"}</span>
          <p className="text-sm text-gray-500">
            {mode === "roast"
              ? "First roast incoming..."
              : "Waiting for the first argument..."}
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.userId === currentUserId}
          mode={mode}
        />
      ))}

      <TypingIndicator typingUsers={typingUsers} />

      <div ref={bottomRef} />
    </div>
  );
}
