-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lap" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Matches" ("createdAt", "id", "lap", "roomId") SELECT "createdAt", "id", "lap", "roomId" FROM "Matches";
DROP TABLE "Matches";
ALTER TABLE "new_Matches" RENAME TO "Matches";
CREATE UNIQUE INDEX "Matches_roomId_key" ON "Matches"("roomId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
