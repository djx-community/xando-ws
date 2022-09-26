/*
  Warnings:

  - Added the required column `lap` to the `MatchLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lap" INTEGER NOT NULL DEFAULT 1,
    "nextMoveBy" INTEGER,
    CONSTRAINT "Matches_nextMoveBy_fkey" FOREIGN KEY ("nextMoveBy") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Matches" ("createdAt", "id", "lap", "nextMoveBy", "roomId") SELECT "createdAt", "id", "lap", "nextMoveBy", "roomId" FROM "Matches";
DROP TABLE "Matches";
ALTER TABLE "new_Matches" RENAME TO "Matches";
CREATE UNIQUE INDEX "Matches_roomId_key" ON "Matches"("roomId");
CREATE TABLE "new_MatchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lap" INTEGER NOT NULL,
    CONSTRAINT "MatchLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchLog" ("column", "createdAt", "id", "matchId", "playerId", "row") SELECT "column", "createdAt", "id", "matchId", "playerId", "row" FROM "MatchLog";
DROP TABLE "MatchLog";
ALTER TABLE "new_MatchLog" RENAME TO "MatchLog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
