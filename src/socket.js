// client/src/socket.js
import { io } from "socket.io-client";

const socket = io("https://wordle-server-0xi8.onrender.com", {
  autoConnect: true,
});

export default socket;

