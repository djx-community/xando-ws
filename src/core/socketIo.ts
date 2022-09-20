import { Server as IoServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {} from "../logic/socketHelper";

export default (server: HttpServer): IoServer => {
  const io = new IoServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", async (socket: Socket) => {});

  return io;
};
