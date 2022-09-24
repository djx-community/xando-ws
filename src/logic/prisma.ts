import { PrismaClient, Player, Matches, MatchPlayers } from "@prisma/client";
import uniqId from "uniqid";
import socketIo from "../core/socketIo";

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
  fetchVacantRoom: () => {
    return prisma.matches.count({});
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
  getPlayerIdBySocketId: (socketId: String) => {
    return prisma.player.findUnique({
      where: { socketId: socketId as string },
    });
  },
  getPlayerIdByRoomId: (roomId: String) => {
    return prisma.matches.findUnique({
      where: { roomId: roomId as string },
    });
  },
};
