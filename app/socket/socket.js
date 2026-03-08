import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = useAuthStore.getState().token;
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
    socket.on("disconnect", (reason) =>
      console.log("🔌 Socket disconnected:", reason),
    );
    socket.on("connect_error", (err) =>
      console.error("Socket error:", err.message),
    );
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (event, data) => {
  const s = getSocket();
  s.emit(event, data);
};
