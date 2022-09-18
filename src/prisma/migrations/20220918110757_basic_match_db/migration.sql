/*
  Warnings:

  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uid` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Match_roomId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Match";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MatchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matcheId" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "MatchLog_matcheId_fkey" FOREIGN KEY ("matcheId") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchPlayers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "playerIcon" TEXT NOT NULL DEFAULT '',
    "point" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MatchPlayers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchPlayers" ("id", "matchId", "playerId") SELECT "id", "matchId", "playerId" FROM "MatchPlayers";
DROP TABLE "MatchPlayers";
ALTER TABLE "new_MatchPlayers" RENAME TO "MatchPlayers";
CREATE UNIQUE INDEX "MatchPlayers_playerId_key" ON "MatchPlayers"("playerId");
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL
);
INSERT INTO "new_Player" ("displayName", "id") SELECT "displayName", "id" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_uid_key" ON "Player"("uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Matches_roomId_key" ON "Matches"("roomId");
