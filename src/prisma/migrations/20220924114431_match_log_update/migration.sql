/*
  Warnings:

  - Added the required column `lap` to the `Matches` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matcheId" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchLog_matcheId_fkey" FOREIGN KEY ("matcheId") REFERENCES "Matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchLog" ("column", "id", "matcheId", "playerId", "row") SELECT "column", "id", "matcheId", "playerId", "row" FROM "MatchLog";
DROP TABLE "MatchLog";
ALTER TABLE "new_MatchLog" RENAME TO "MatchLog";
CREATE TABLE "new_Matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lap" INTEGER NOT NULL
);
INSERT INTO "new_Matches" ("createdAt", "id", "roomId") SELECT "createdAt", "id", "roomId" FROM "Matches";
DROP TABLE "Matches";
ALTER TABLE "new_Matches" RENAME TO "Matches";
CREATE UNIQUE INDEX "Matches_roomId_key" ON "Matches"("roomId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
