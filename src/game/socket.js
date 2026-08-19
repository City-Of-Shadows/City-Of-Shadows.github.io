import { io } from "socket.io-client";
const SOCKET_URL = "https://server-production-d49f3.up.railway.app/";
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: { token: localStorage.getItem("game_token") || "",},});
export default socket;
