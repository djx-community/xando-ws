import { Server as IoServer } from "socket.io";
import { Server as HttpServer } from "http";

export default (server: HttpServer) => {
  const io = new IoServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
  });

  io.on("disconnect", (socket) => {
    console.log("hello");
  });
};
