import { Server as IoServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import socketHelper from "../logic/socketHelper";
import { Payload } from "../config/types";
import { Player } from "@prisma/client";

export default (server: HttpServer): IoServer => {
  const io = new IoServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("player", async (payload: Payload) => {
      if (payload.action === "create") {
        const player = await socketHelper.createPlayer({
          ...payload.data,
          socketId: socket.id,
        } as Player);
        socket.emit("player", player);
      }
      if (payload.action === "update") {
        const player = await socketHelper.updatePlayer(
          payload.data as Player,
          socket.id
        );
        socket.emit("player", player);
      }
    });

    socket.on("match", async (payload: Payload) => {});

    socket.on("quick_play", async (payload: Payload) => {
      let playerIcon: "X" | "O" = "O";
      let roomId: String = "";

      socketHelper.checkAvailableRoom();

      if (roomId === "") {
        roomId = await socketHelper.createRoom();
        playerIcon = "X";
      }

      socketHelper.joinPlayerToRoom(socket.id, roomId, playerIcon);
      socket.join(roomId as string);

      if(playerIcon==='O'){
        // start game todo
      }
    });

    socket.on("play_with_friend", (payload: Payload) => {
      if (payload.action === "request") {
      }

      if (payload.action === "response") {
      }
    });

    socket.on("disconnect", async (reason: String) => {
      try {
        await socketHelper.deletePlayer(socket.id);
      } catch (e) {
        console.log(e);
      }
    });
  });

  return io;
};
