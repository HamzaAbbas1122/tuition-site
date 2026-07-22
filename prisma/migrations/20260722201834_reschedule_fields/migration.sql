/*
  Warnings:

  - You are about to drop the column `rescheduledTo` on the `ClassSession` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tuitionId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "classLink" TEXT,
    "rescheduleRequestedBy" TEXT,
    "rescheduleProposedTime" DATETIME,
    "rescheduleReason" TEXT,
    "rescheduleStatus" TEXT,
    CONSTRAINT "ClassSession_tuitionId_fkey" FOREIGN KEY ("tuitionId") REFERENCES "TuitionClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClassSession" ("classLink", "date", "endTime", "id", "status", "tuitionId") SELECT "classLink", "date", "endTime", "id", "status", "tuitionId" FROM "ClassSession";
DROP TABLE "ClassSession";
ALTER TABLE "new_ClassSession" RENAME TO "ClassSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
