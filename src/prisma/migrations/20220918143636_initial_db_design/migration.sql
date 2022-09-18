/*
  Warnings:

  - You are about to drop the column `uid` on the `Player` table. All the data in the column will be lost.
  - The required column `uuid` was added to the `Player` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL
);
INSERT INTO "new_Player" ("displayName", "id", "socketId") SELECT "displayName", "id", "socketId" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_uuid_key" ON "Player"("uuid");
CREATE UNIQUE INDEX "Player_socketId_key" ON "Player"("socketId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
