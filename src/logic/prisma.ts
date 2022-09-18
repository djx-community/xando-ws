import { PrismaClient, Player } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  createPlayer: () => {},
  updatePlayer: (data: Player, where: Object): Promise<Player> => {
    return prisma.player.update({
      where: where,
      data: data,
    });
  },
};
