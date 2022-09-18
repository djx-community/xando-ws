-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "socketId" TEXT NOT NULL DEFAULT '',
    "displayName" TEXT NOT NULL
);
INSERT INTO "new_Player" ("displayName", "id", "uid") SELECT "displayName", "id", "uid" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_uid_key" ON "Player"("uid");
CREATE UNIQUE INDEX "Player_socketId_key" ON "Player"("socketId");
CREATE TABLE "new_Matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Matches" ("id", "roomId") SELECT "id", "roomId" FROM "Matches";
DROP TABLE "Matches";
ALTER TABLE "new_Matches" RENAME TO "Matches";
CREATE UNIQUE INDEX "Matches_roomId_key" ON "Matches"("roomId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
