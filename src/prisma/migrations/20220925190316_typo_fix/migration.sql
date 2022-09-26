/*
  Warnings:

  - You are about to drop the column `matcheId` on the `MatchLog` table. All the data in the column will be lost.
  - Added the required column `matchId` to the `MatchLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchLog" ("column", "createdAt", "id", "playerId", "row") SELECT "column", "createdAt", "id", "playerId", "row" FROM "MatchLog";
DROP TABLE "MatchLog";
ALTER TABLE "new_MatchLog" RENAME TO "MatchLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
