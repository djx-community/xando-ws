import { Player } from "@prisma/client";
import uniqId from "uniqid";
import socketIo from "../core/socketIo";
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
    return new Promise((resolve, reject) => {
      prisma.fetchVacantRoom();
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
  joinPlayerToRoom: (socketId: String, roomId: String) => {
    return new Promise(async (resolve, reject) => {
      const playerId: Number =
        (await prisma.getPlayerIdBySocketId(socketId))?.id || 0;
    });
  },
};
