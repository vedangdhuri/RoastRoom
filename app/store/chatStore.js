import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  collection, addDoc, query, orderBy, onSnapshot,
  doc, setDoc, deleteDoc, serverTimestamp, limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useChatStore = create(
  immer((set, get) => ({
    messages: [],
    typingUsers: {},
    presenceMap: {},
    unsubscribers: [],

    // Subscribe to real-time chat messages for a room
    subscribeMessages: (roomId) => {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(200));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set((state) => { state.messages = msgs; });
      });

      set((state) => { state.unsubscribers.push(unsubscribe); });
      return unsubscribe;
    },

    // Send a chat message
    sendMessage: async (roomId, { userId, username, text, roundNumber }) => {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesRef, {
        userId,
        username,
        text,
        roundNumber: roundNumber || 1,
        scorePreview: null,
        timestamp: serverTimestamp(),
      });
    },

    // Subscribe to typing indicators
    subscribeTyping: (roomId) => {
      const typingRef = collection(db, 'rooms', roomId, 'typing');
      const unsubscribe = onSnapshot(typingRef, (snapshot) => {
        const typing = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.isTyping) typing[doc.id] = data;
        });
        set((state) => { state.typingUsers = typing; });
      });

      set((state) => { state.unsubscribers.push(unsubscribe); });
      return unsubscribe;
    },

    // Set typing status
    setTyping: async (roomId, userId, isTyping) => {
      const typingDoc = doc(db, 'rooms', roomId, 'typing', userId);
      if (isTyping) {
        await setDoc(typingDoc, { isTyping: true, updatedAt: serverTimestamp() });
      } else {
        await deleteDoc(typingDoc).catch(() => {});
      }
    },

    // Subscribe to presence
    subscribePresence: (roomId) => {
      const presenceRef = collection(db, 'rooms', roomId, 'presence');
      const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
        const presence = {};
        snapshot.docs.forEach((doc) => {
          presence[doc.id] = doc.data();
        });
        set((state) => { state.presenceMap = presence; });
      });

      set((state) => { state.unsubscribers.push(unsubscribe); });
      return unsubscribe;
    },

    // Set user presence
    setPresence: async (roomId, userId, username) => {
      const presenceDoc = doc(db, 'rooms', roomId, 'presence', userId);
      await setDoc(presenceDoc, {
        online: true,
        lastSeen: serverTimestamp(),
        username,
      });
    },

    // Remove presence on leave
    removePresence: async (roomId, userId) => {
      const presenceDoc = doc(db, 'rooms', roomId, 'presence', userId);
      await setDoc(presenceDoc, {
        online: false,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    },

    // Update score preview on a message
    updateScorePreview: async (roomId, messageId, score) => {
      const messageDoc = doc(db, 'rooms', roomId, 'messages', messageId);
      await setDoc(messageDoc, { scorePreview: { total: score } }, { merge: true });
    },

    // Clean up all subscriptions
    unsubscribeAll: () => {
      const { unsubscribers } = get();
      unsubscribers.forEach((unsub) => unsub());
      set((state) => {
        state.messages = [];
        state.typingUsers = {};
        state.presenceMap = {};
        state.unsubscribers = [];
      });
    },
  }))
);
