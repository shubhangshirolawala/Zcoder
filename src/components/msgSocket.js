// src/components/msgSocket.js
import { io } from "socket.io-client";

let socket;
export function initMessageSocket(userId) {
  if (!socket) {
    socket = io("http://localhost:7000", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("[MSG CLIENT] Connected", socket.id);
      if (userId) {
        socket.emit("add-user", userId);
      }
    });
  } else {
    // if socket already exists, ensure user is registered again
    if (userId) {
      console.log("[MSG CLIENT] Re-registering user on existing socket:", userId);
      socket.emit("add-user", userId);
    }
  }
  return socket;
}

export function getMessageSocket() {
  if (!socket) console.warn("[MSG CLIENT] Socket not initialized yet");
  return socket;
}

export function sendMessage({ from, to, message }) {
  if (!socket) throw new Error("[MSG CLIENT] Socket not initialized");
  socket.emit("send-msg", { from, to, msg: message }); // 'msg' matches server
}
