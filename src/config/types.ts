import { Player, Player as prismaPlayer } from "@prisma/client";

export interface Payload {
  action: string;
  data: Object | Player;
}
