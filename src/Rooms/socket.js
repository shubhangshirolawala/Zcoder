// socketRoom.js
import { io } from "socket.io-client";
export const initRoomSocket = () => {
  return io("http://localhost:5000", { transports: ["websocket"] });
};
// export const initMessageSocket = () => {
//   return io("http://localhost:7000", { transports: ["websocket"] });
// };
