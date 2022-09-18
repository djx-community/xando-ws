/*
  Warnings:

  - You are about to drop the column `matchPlayersId` on the `Player` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `MatchPlayers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchPlayers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "MatchPlayers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchPlayers" ("id", "matchId") SELECT "id", "matchId" FROM "MatchPlayers";
DROP TABLE "MatchPlayers";
ALTER TABLE "new_MatchPlayers" RENAME TO "MatchPlayers";
CREATE UNIQUE INDEX "MatchPlayers_playerId_key" ON "MatchPlayers"("playerId");
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL
);
INSERT INTO "new_Player" ("displayName", "id") SELECT "displayName", "id" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
