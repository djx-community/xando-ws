import { Player as prismaPlayer } from "@prisma/client";

interface payloadData extends prismaPlayer {
  friendUuid: string;
  response: "accept" | "reject";
  roomId: string;
  opponent: prismaPlayer;
  [key: string]: any;
}
export interface Payload {
  action: string;
  data: payloadData;
}
