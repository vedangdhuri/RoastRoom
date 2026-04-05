"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";

/**
 * useChat – manages Firebase real-time subscriptions for a given room.
 * Automatically unsubscribes on unmount.
 */
export function useChat(roomId) {
  const {
    messages,
    typingUsers,
    presenceMap,
    subscribeMessages,
    subscribeTyping,
    subscribePresence,
    sendMessage,
    setTyping,
    setPresence,
    removePresence,
    updateScorePreview,
    unsubscribeAll,
  } = useChatStore();

  const { user, profile } = useAuthStore();
  const typingTimer = useRef(null);

  // Subscribe to all Firestore collections when roomId is ready
  useEffect(() => {
    if (!roomId) return;

    subscribeMessages(roomId);
    subscribeTyping(roomId);
    subscribePresence(roomId);

    // Mark current user as online
    if (user?.id) {
      setPresence(roomId, user.id, profile?.username ?? "Player");
    }

    return () => {
      // Mark offline then unsubscribe
      if (user?.id) removePresence(roomId, user.id).catch(() => {});
      unsubscribeAll();
    };
  }, [roomId, user?.id]);

  /** Send a chat message */
  const send = useCallback(
    async (text, roundNumber = 1) => {
      if (!roomId || !user?.id || !text.trim()) return;
      await sendMessage(roomId, {
        userId: user.id,
        username: profile?.username ?? "Player",
        text: text.trim(),
        roundNumber,
      });
    },
    [roomId, user?.id, profile?.username, sendMessage]
  );

  /** Notify typing with 2 s auto-clear */
  const notifyTyping = useCallback(() => {
    if (!roomId || !user?.id) return;
    setTyping(roomId, user.id, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(roomId, user.id, false);
    }, 2000);
  }, [roomId, user?.id, setTyping]);

  /** Clear typing immediately (on send) */
  const stopTyping = useCallback(() => {
    if (!roomId || !user?.id) return;
    clearTimeout(typingTimer.current);
    setTyping(roomId, user.id, false);
  }, [roomId, user?.id, setTyping]);

  // Other users who are currently typing
  const othersTyping = Object.fromEntries(
    Object.entries(typingUsers).filter(([id]) => id !== user?.id)
  );

  const onlineUsers = Object.values(presenceMap).filter((p) => p.online);

  return {
    messages,
    typingUsers: othersTyping,
    presenceMap,
    onlineUsers,
    send,
    notifyTyping,
    stopTyping,
    updateScorePreview,
  };
}
