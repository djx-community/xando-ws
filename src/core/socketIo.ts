import { Server as IoServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import socketHelper from "../logic/socketHelper";
import { Payload } from "../config/types";
import { Matches, MatchPlayers, Player } from "@prisma/client";

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

    //quick play listener
    socket.on("quick_play", async (payload: Payload) => {
      let playerIcon: "X" | "O" = "O";
      let roomId: string = "";

      roomId = await socketHelper.checkAvailableRoom();

      if (roomId === "") {
        roomId = await socketHelper.createRoom();
        playerIcon = "X";
      }

      await socketHelper.joinPlayerToRoom(socket.id, roomId, playerIcon);
      socket.join(roomId);

      if (playerIcon === "O") {
        //selecting first player using random number
        const matchPlayers: MatchPlayers[] = await socketHelper.getMatchPlayers(
          {
            roomId,
          } as Matches
        );
        const nextMoveBy =
          matchPlayers[Math.floor(Math.random() * (2 - 0) + 0)].playerId;

        socketHelper.updateMatch(
          { nextMoveBy } as Matches,
          { roomId } as Matches
        );

        // start game todo
        io.sockets.in(roomId).emit("match", {
          action: "start",
          data: {
            nextMoveBy,
          },
        });
      }
    });

    socket.on("play_with_friend", async (payload: Payload) => {
      if (payload.action === "request") {
        const player = await socketHelper.getPlayerBySocketId(socket.id);

        if (player === null) {
          //todo
        }

        //creating and joining to room
        const roomId: string = socketHelper.generateRoomId();
        socket.join(roomId);

        socket.join(payload.data.friendUuid);

        socket.to(payload.data.friendUuid).emit("player", {
          action: "match_request",
          data: {
            by: player,
            roomId,
          },
        });

        socket.leave(payload.data.friendUuid);
      }

      if (payload.action === "response") {
        if (payload.data.response === "accept") {
          //creating room and joining players to room
          const roomId = await socketHelper.createRoom(payload.data.roomId);

          await socketHelper.joinPlayerToRoom(socket.id, roomId, "O");
          await socketHelper.joinPlayerToRoom(
            payload.data.opponent.socketId,
            roomId,
            "X"
          );

          // joining to game room
          socket.join(payload.data.roomId);

          //selecting first player using random number
          const matchPlayers: MatchPlayers[] =
            await socketHelper.getMatchPlayers({
              roomId,
            } as Matches);

          const nextMoveBy =
            matchPlayers[Math.floor(Math.random() * (2 - 0) + 0)].playerId;

          socketHelper.updateMatch(
            { nextMoveBy } as Matches,
            { roomId } as Matches
          );

          // start game todo
          io.sockets.in(roomId).emit("match", {
            action: "start",
            data: {
              nextMoveBy,
            },
          });
        } else {
        }
      }
    });

    socket.on("match", async (payload: Payload) => {});

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
