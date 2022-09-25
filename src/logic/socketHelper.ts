import { Matches, MatchPlayers, Player } from "@prisma/client";
import uniqId from "uniqid";
import prisma from "./prisma";

export default {
  createPlayer: (player: Player): Promise<Player> => {
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
  checkAvailableRoom: (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const matches = await prisma.getVacantMatch();
      if (matches.length === 0) resolve("");
      else
        resolve((await prisma.getMatchById(matches[0].matchId))?.roomId || "");
    });
  },
  createRoom: (roomId: string | null = null): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      // const roomId = ;
      resolve(await (await prisma.createRoom(roomId)).roomId);
    });
  },
  deletePlayer: (socketId: string) => {
    return new Promise((resolve, reject) => {
      resolve(prisma.deletePlayer(socketId));
    });
  },
  joinPlayerToRoom: (
    socketId: string,
    roomId: String,
    playerIcon: "X" | "O"
  ) => {
    return new Promise(async (resolve, reject) => {
      const playerId: Number =
        (await prisma.getPlayerBySocketId(socketId))?.id || 0;
      const matchId: Number = (await prisma.getMatchByRoomId(roomId))?.id || 0;

      if (playerId !== 0 && matchId !== 0) {
        resolve(
          await prisma.joinPlayerToRoom({
            matchId,
            playerId,
            playerIcon,
          } as MatchPlayers)
        );
      }
    });
  },
  getPlayerBySocketId: (socketId: string): Promise<Player | null> => {
    return new Promise(async (resolve, reject) => {
      resolve(await prisma.getPlayerBySocketId(socketId));
    });
  },
  generateRoomId: (): string => {
    return "room_" + uniqId.process();
  },
  getMatchPlayers: (where: Matches): Promise<MatchPlayers[]> => {
    return new Promise(async (resolve, reject) => {
      const matchPlayers = await prisma.getMatch(where);

      if (matchPlayers) resolve(matchPlayers.players);
      // else resolve([] as MatchPlayers[]);
    });
  },
  updateMatch: (data: Matches, where: Matches) => {
    return new Promise(async (resolve, reject) => {
      resolve(await prisma.updateMatch(data, where));
    });
  },
};
