import {
  PrismaClient,
  Player,
  Matches,
  MatchPlayers,
  MatchLog,
} from "@prisma/client";
import uniqId from "uniqid";

const prisma = new PrismaClient();

export default {
  createPlayer: (data: Player) => {
    return prisma.player.create({ data });
  },
  updatePlayer: (data: Player, where: Player): Promise<Player> => {
    return prisma.player.update({
      where: where,
      data: data,
    });
  },
  getVacantMatch: () => {
    return prisma.matchPlayers.groupBy({
      by: ["matchId"],
      having: {
        matchId: {
          _count: {
            equals: 1,
          },
        },
      },
    });
  },
  createRoom: (roomId: string | null) => {
    return prisma.matches.create({
      data: { roomId: roomId || "room_" + uniqId.process() },
    });
  },
  joinPlayerToRoom: (data: MatchPlayers) => {
    return prisma.matchPlayers.create({
      data: data,
    });
  },
  deletePlayer: (socketId: String) => {
    return prisma.player.delete({ where: { socketId: socketId as string } });
  },
  getPlayerBySocketId: (socketId: String) => {
    return prisma.player.findUnique({
      where: { socketId: socketId as string },
    });
  },
  getMatchByRoomId: (roomId: String) => {
    return prisma.matches.findUnique({
      where: { roomId: roomId as string },
    });
  },
  getMatchById: (matchId: Number) => {
    return prisma.matches.findUnique({
      where: {
        id: matchId as number,
      },
    });
  },
  getPlayerByUuid: (uuid: String) => {
    return prisma.player.findUnique({
      where: {
        uuid: uuid as string,
      },
    });
  },
  getMatch: (where: Matches) => {
    return prisma.matches.findUnique({
      where,
      include: {
        players: true,
      },
    });
  },
  updateMatch: (data: Matches, where: Matches) => {
    return prisma.matches.update({
      data,
      where,
    });
  },
  logMove: (moveProp: MatchLog) => {
    return prisma.matchLog.create({ data: moveProp });
  },
  getMatchLog: (where: MatchLog) => {
    return prisma.matchLog.findMany({
      where,
    });
  },
  updateLap: (matchId: number) => {
    return prisma.matches.update({
      data: {
        lap: {
          increment: 1,
        },
      },
      where: {
        id: matchId,
      },
    });
  },
  updatePlayerPont: (playerId: number, matchId: number) => {
    return prisma.matchPlayers.updateMany({
      data: {
        point: { increment: 1 },
      },
      where: {
        matchId,
        playerId,
      },
    });
  },
  getMatchPlayers: (where: MatchPlayers & { NOT: any }) => {
    return prisma.matchPlayers.findMany({
      where,
    });
  },
};
