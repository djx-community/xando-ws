import { Matches, MatchLog, MatchPlayers, Player } from "@prisma/client";
import { match } from "assert";
import uniqId from "uniqid";
import utils from "../utils/utils";
import prisma from "./prisma";

export default {
  createPlayer: (player: Player): Promise<Player> => {
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
      } catch (e) {
        reject(e);
      }
    });
  },
  checkAvailableRoom: (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const matches = await prisma.getVacantMatch();
      if (matches.length === 0) resolve("");
      else
        resolve((await prisma.getMatchById(matches[0].matchId))?.roomId || "");
    });
  },
  createRoom: (roomId: string | null = null): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      // const roomId = ;
      resolve(await (await prisma.createRoom(roomId)).roomId);
    });
  },
  deletePlayer: (socketId: string) => {
    return new Promise((resolve, reject) => {
      resolve(prisma.deletePlayer(socketId));
    });
  },
  joinPlayerToRoom: (
    socketId: string,
    roomId: String,
    playerIcon: "X" | "O"
  ) => {
    return new Promise(async (resolve, reject) => {
      const playerId: Number =
        (await prisma.getPlayerBySocketId(socketId))?.id || 0;
      const matchId: Number = (await prisma.getMatchByRoomId(roomId))?.id || 0;

      if (playerId !== 0 && matchId !== 0) {
        try {
          const matchPlayer = await prisma.joinPlayerToRoom({
            matchId,
            playerId,
            playerIcon,
          } as MatchPlayers);
          resolve(match);
        } catch (e) {
          reject(e);
        }
      }
    });
  },
  getPlayerBySocketId: (socketId: string): Promise<Player> => {
    return new Promise(async (resolve, reject) => {
      const player = await prisma.getPlayerBySocketId(socketId);
      if (player) resolve(player);
      else resolve({} as Player);
    });
  },
  generateRoomId: (): string => {
    return "room_" + uniqId.process();
  },
  getMatchPlayers: (where: Matches): Promise<MatchPlayers[]> => {
    return new Promise(async (resolve, reject) => {
      const matchPlayers = await prisma.getMatch(where);

      if (matchPlayers) resolve(matchPlayers.players);
      else resolve([]);
    });
  },
  updateMatch: (data: Matches, where: Matches) => {
    return new Promise(async (resolve, reject) => {
      resolve(await prisma.updateMatch(data, where));
    });
  },
  getMatch: (
    where: Matches
  ): Promise<Matches & { players: MatchPlayers[] }> => {
    return new Promise(async (resolve, reject) => {
      const match = await prisma.getMatch(where);
      if (match) resolve(match);
      else resolve({} as Matches & { players: MatchPlayers[] });
    });
  },
  isDuplicateMove: (where: MatchLog) => {
    return new Promise(async (resolve, reject) => {
      (await prisma.getDuplicateLogCount(where)) === 0
        ? resolve(false)
        : resolve(true);
    });
  },
  registerMove: (moveProp: MatchLog): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.logMove(moveProp);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  },
  checkLapWon: (
    lapNo: number,
    matchId: number
  ): Promise<{
    cells: { column: number; row: number }[];
    playerId: number;
  } | null> => {
    return new Promise(async (resolve, reject) => {
      const logRows: MatchLog[] = await prisma.getMatchLog({
        matchId,
        lap: lapNo,
      } as MatchLog);

      if (logRows.length >= 5) {
        //need minimum 5 move to win
        const map: Map<number, Map<number, number>> = utils.mapRowsIntoMap(
          logRows
        );

        Promise.all([
          utils.checkDiagonal(map),
          utils.checkRows(map),
          utils.checkColumn(map),
        ]).then(async (res) => {
          const [diagonal, row, column] = res;
          if (diagonal || row || column) {
            try {
              await prisma.updateLap(matchId);
              await prisma.updatePlayerPont(
                (diagonal?.playerId ||
                  row?.playerId ||
                  column?.playerId) as number,
                matchId
              );
              resolve(diagonal || row || column);
            } catch (e) {
              reject(e);
            }
          } else if (logRows.length === 9) {
            await prisma.updateLap(matchId);
            resolve({
              playerId: 0,
              cells: [],
            });
          } else resolve(null);
        });
      } else resolve(null);
    });
  },
  getOpponent: (matchId: number, playerId: number): Promise<MatchPlayers> => {
    return new Promise(async (resolve, reject) => {
      const players = await prisma.getMatchPlayers({
        matchId,
      } as MatchPlayers & { NOT: any });
      resolve(players.filter((val) => val.playerId != playerId)[0]);
    });
  },
  checkMatchWon: (matchId: number): Promise<number | null> => {
    return new Promise(async (resolve, reject) => {
      const match = await prisma.getMatch({ id: matchId } as Matches);
      if (match?.lap === 4) {
        const players = match.players;
        if (players[0].point > players[1].point) resolve(players[0].playerId);
        else if (players[1].point > players[0].point) resolve(players[1].point);
        else if (players[1].point === players[0].point) resolve(0);
      } else resolve(null);
    });
  },
  endMatch: (matchId: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const deleteMatch = prisma.deleteMatch({ id: matchId } as Matches);
      deleteMatch.then(() => {
        resolve(true);
      });
    });
  },
  getMatchPlayer: (playerId: number): Promise<MatchPlayers | null> => {
    return new Promise(async (resolve, reject) => {
      resolve(await prisma.getMatchPlayer(playerId));
    });
  },
};
