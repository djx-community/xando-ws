import { Player as prismaPlayer } from "@prisma/client";

interface payloadData extends prismaPlayer {
  friendUuid: string;
}
export interface Payload {
  action: string;
  data: payloadData;
}
