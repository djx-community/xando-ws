import { PrismaClient, Player, Matches, MatchPlayers } from "@prisma/client";
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
  createRoom: () => {
    return prisma.matches.create({
      data: { roomId: "room_" + uniqId.process() },
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
};
