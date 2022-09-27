-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lap" INTEGER NOT NULL,
    CONSTRAINT "MatchLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchLog" ("column", "createdAt", "id", "lap", "matchId", "playerId", "row") SELECT "column", "createdAt", "id", "lap", "matchId", "playerId", "row" FROM "MatchLog";
DROP TABLE "MatchLog";
ALTER TABLE "new_MatchLog" RENAME TO "MatchLog";
CREATE TABLE "new_MatchPlayers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "playerIcon" TEXT NOT NULL DEFAULT '',
    "point" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MatchPlayers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchPlayers" ("id", "matchId", "playerIcon", "playerId", "point") SELECT "id", "matchId", "playerIcon", "playerId", "point" FROM "MatchPlayers";
DROP TABLE "MatchPlayers";
ALTER TABLE "new_MatchPlayers" RENAME TO "MatchPlayers";
CREATE UNIQUE INDEX "MatchPlayers_playerId_key" ON "MatchPlayers"("playerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
