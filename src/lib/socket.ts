import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {

  if (typeof window === "undefined") {
    return socket as Socket;
  }

  if (!socket) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER;

    if (!SOCKET_URL) {
      throw new Error("Socket server URL not defined");
    }

    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // avoid duplicate listeners in dev
    socket.removeAllListeners();

    socket.on("connect", () => {
      console.log("Connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", (err) => {
      if (err.message === "websocket error") return;
      console.error("Connection error:", err.message);
    });
  }

  return socket;
};





