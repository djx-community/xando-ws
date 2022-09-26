import { Player as prismaPlayer } from "@prisma/client";

export interface payloadData extends prismaPlayer {
  friendUuid: string;
  response: "accept" | "reject";
  roomId: string;
  opponent: prismaPlayer;
  [key: string]: any;
  column: number;
  row: number;
}
export interface Payload {
  action: string;
  data: payloadData;
}
