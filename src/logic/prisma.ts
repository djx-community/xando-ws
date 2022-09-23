import { PrismaClient, Player } from "@prisma/client";

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
};
