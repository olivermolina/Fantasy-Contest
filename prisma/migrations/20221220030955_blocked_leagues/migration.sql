/*
  Warnings:

  - You are about to drop the column `reasonCodes` on the `SpecialRestriction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SpecialRestriction" DROP COLUMN "reasonCodes",
ADD COLUMN     "blockedLeagues" "League"[],
ADD COLUMN     "blockedReasonCodes" TEXT[];
