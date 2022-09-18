import { Server as IoServer } from "socket.io";
import { Server as HttpServer } from "http";
import {} from "../logic/socketHelper";

export default (server: HttpServer): IoServer => {
  const io = new IoServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {});

  io.on("disconnect", (socket) => {});

  return io;
};
