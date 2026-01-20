import { io } from "socket.io-client";

export const socket = io("https://your-api-url.com", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket Connected");
});
