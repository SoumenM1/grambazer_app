import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";

const SOCKET_URL =
  // Platform.OS === "android"
  //   ? "http://192.168.0.118:5000"
  //   : "http://192.168.0.118:5000";
  Platform.OS === "android"
    ? "https://server.gramseba.in"
    : "https://server.gramseba.in";

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"], // 🚀 fast
      reconnection: true, // Disable automatic reconnection
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:");
    });

    socket.on("connect_error", (err) => {
      console.log("⚠️ Socket error:", err.message);
    });
  }

  return socket;
}
