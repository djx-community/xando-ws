import { PrismaClient } from "@prisma/client";

export default {
  clearDb: async () => {
    const prisma = new PrismaClient();
    await prisma.matchLog.deleteMany({});
    await prisma.matchPlayers.deleteMany({});
    await prisma.matches.deleteMany({});
    await prisma.player.deleteMany({});
  },
};
