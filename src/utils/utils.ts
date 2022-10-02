import { MatchLog, PrismaClient } from "@prisma/client";

export default {
  clearDb: async () => {
    const prisma = new PrismaClient();
    await prisma.matchLog.deleteMany({});
    await prisma.matchPlayers.deleteMany({});
    await prisma.matches.deleteMany({});
    await prisma.player.deleteMany({});
  },
  mapRowsIntoMap: (rows: MatchLog[]): Map<number, Map<number, number>> => {
    let map = new Map<number, Map<number, number>>();
    rows.forEach((element) => {
      if (map.has(element.column)) {
        const tempMap = map.get(element.column);
        if (tempMap !== undefined) {
          tempMap.set(element.row, element.playerId);
          map.set(element.column, tempMap);
        }
      } else {
        map.set(
          element.column,
          new Map<number, number>([[element.row, element.playerId]])
        );
      }
    });
    return map;
  },
  checkRows: (
    map: Map<number, Map<number, number>>
  ): Promise<{
    cells: { column: number; row: number }[];
    playerId: number;
  } | null> => {
    return new Promise(async (resolve, reject) => {
      let isMatching: number | null = null;
      let n: number;
      for (n = 0; n < 3; n++) {
        const cell1 = map.get(0)?.get(n);
        const cell2 = map.get(1)?.get(n);
        const cell3 = map.get(2)?.get(n);

        const isDefined =
          cell1 !== undefined && cell2 !== undefined && cell3 !== undefined;
        const isSame = cell1 === cell2 && cell2 === cell3;

        if (isDefined && isSame) {
          isMatching = cell1;
          break;
        }
      }
      if (isMatching === null) {
        resolve(null);
      } else {
        resolve({
          playerId: isMatching,
          cells: [
            {
              column: 0,
              row: n,
            },
            {
              column: 1,
              row: n,
            },
            {
              column: 2,
              row: n,
            },
          ],
        });
      }
    });
  },
  checkColumn: (
    map: Map<number, Map<number, number>>
  ): Promise<{
    cells: { column: number; row: number }[];
    playerId: number;
  } | null> => {
    return new Promise(async (resolve, reject) => {
      let isMatching: number | null = null;
      let n: number;
      for (n = 0; n < 3; n++) {
        const cell1 = map.get(n)?.get(0);
        const cell2 = map.get(n)?.get(1);
        const cell3 = map.get(n)?.get(2);

        const isDefined =
          cell1 !== undefined && cell2 !== undefined && cell3 !== undefined;
        const isSame = cell1 === cell2 && cell2 === cell3;

        if (isDefined && isSame) {
          isMatching = cell1;
          break;
        }
      }
      if (isMatching === null) {
        resolve(null);
      } else {
        resolve({
          playerId: isMatching,
          cells: [
            {
              column: n,
              row: 0,
            },
            {
              column: n,
              row: 1,
            },
            {
              column: n,
              row: 2,
            },
          ],
        });
      }
    });
  },
  checkDiagonal: (
    map: Map<number, Map<number, number>>
  ): Promise<{
    cells: { column: number; row: number }[];
    playerId: number;
  } | null> => {
    return new Promise(async (resolve, reject) => {
      const cell1 = map.get(0)?.get(0);
      const cell2 = map.get(1)?.get(1);
      const cell3 = map.get(2)?.get(2);

      const isDefined =
        cell1 !== undefined && cell2 !== undefined && cell3 !== undefined;
      const isSame = cell1 === cell2 && cell2 === cell3;

      if (isDefined && isSame) {
        resolve({
          playerId: cell1,
          cells: [
            {
              column: 0,
              row: 0,
            },
            {
              column: 1,
              row: 1,
            },
            {
              column: 2,
              row: 2,
            },
          ],
        });
      } else {
        const cell1 = map.get(0)?.get(2);
        const cell3 = map.get(2)?.get(0);

        const isDefined =
          cell1 !== undefined && cell2 !== undefined && cell3 !== undefined;
        const isSame = cell1 === cell2 && cell2 === cell3;

        if (isDefined && isSame)
          resolve({
            playerId: cell1,
            cells: [
              {
                column: 0,
                row: 2,
              },
              {
                column: 1,
                row: 1,
              },
              {
                column: 2,
                row: 0,
              },
            ],
          });
        else resolve(null);
      }
    });
  },
};
