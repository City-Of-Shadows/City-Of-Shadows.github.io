import { io } from "socket.io-client";

const SOCKET_URL = "https://server-production-d49f3.up.railway.app";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export function connectSocket() {
  const token = localStorage.getItem("game_auth_token");

  socket.auth = {
    token: token || "",
  };

  if (!socket.connected) {
    socket.connect();
  }
}

export default socket;
