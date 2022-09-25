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
        const player: Player = await socketHelper.createPlayer({
          ...payload.data,
          socketId: socket.id,
        } as Player);

        socket.join(player.uuid); //joining to unique room

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

    //quick play listener
    socket.on("quick_play", async (payload: Payload) => {
      let playerIcon: "X" | "O" = "O";
      let roomId: string = "";

      roomId = await socketHelper.checkAvailableRoom();

      if (roomId === "") {
        roomId = await socketHelper.createRoom();
        playerIcon = "X";
      }

      socketHelper.joinPlayerToRoom(socket.id, roomId, playerIcon);
      socket.join(roomId);

      if (playerIcon === "O") {
        // start game todo
      }
    });

    socket.on("play_with_friend", async (payload: Payload) => {
      if (payload.action === "request") {
        const player = await socketHelper.getPlayerBySocketId(socket.id);

        if (player === null) {
          //todo
        }

        socket.join(payload.data.friendUuid);

        socket.to(payload.data.friendUuid).emit("player", {
          action: "match_request",
          data: {
            by: player,
          },
        });

        socket.leave(payload.data.friendUuid);
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
