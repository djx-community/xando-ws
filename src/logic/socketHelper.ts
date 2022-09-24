import { MatchPlayers, Player } from "@prisma/client";
import uniqId from "uniqid";
import prisma from "./prisma";

export default {
  createPlayer: (player: Player) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.createPlayer({ ...player, uuid: uniqId.process() })
        );
      } catch {}
    });
  },
  updatePlayer: (data: Player, socketId: String) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await prisma.updatePlayer(data, { socketId: socketId } as Player)
        );
      } catch (e) {}
    });
  },
  checkAvailableRoom: (): Promise<String> => {
    return new Promise(async (resolve, reject) => {
      const matches = await prisma.getVacantMatch();
      if (matches.length === 0) resolve("");
      else
        resolve((await prisma.getMatchById(matches[0].matchId))?.roomId || "");
    });
  },
  createRoom: (): Promise<String> => {
    return new Promise(async (resolve, reject) => {
      const roomId = await (await prisma.createRoom()).roomId;
      resolve(roomId);
    });
  },
  deletePlayer: (socketId: String) => {
    return new Promise((resolve, reject) => {
      resolve(prisma.deletePlayer(socketId));
    });
  },
  joinPlayerToRoom: (
    socketId: String,
    roomId: String,
    playerIcon: "X" | "O"
  ) => {
    return new Promise(async () => {
      const playerId: Number =
        (await prisma.getPlayerBySocketId(socketId))?.id || 0;
      const matchId: Number = (await prisma.getMatchByRoomId(roomId))?.id || 0;

      if (playerId !== 0 && matchId !== 0) {
        await prisma.joinPlayerToRoom({
          matchId,
          playerId,
          playerIcon,
        } as MatchPlayers);
      }
    });
  },
};
