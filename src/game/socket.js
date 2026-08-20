import { io } from "socket.io-client";

const SOCKET_URL =
  "https://server-production-d49f3.up.railway.app";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error(
    "❌ SOCKET CONNECTION ERROR:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log("🔴 SOCKET DISCONNECTED:", reason);
});

export function connectSocket() {
  const token =
    localStorage.getItem("game_auth_token");

  if (!token) {
    console.error("❌ No authentication token");
    return;
  }

  socket.auth = {
    token,
  };

  socket.connect();
}

export default socket;
