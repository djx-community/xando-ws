import { PrismaClient, Player } from "@prisma/client";
import uniqid from 'uniqid';

const prisma = new PrismaClient();



export default {
  createPlayer: (data: Player) => {
    data.uuid=uniqid.process();
    return prisma.player.create({data})
  },
  updatePlayer: (data: Player, where: Object): Promise<Player> => {
    return prisma.player.update({
      where: where,
      data: data,
    });
  },
};
