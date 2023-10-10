/*
  Warnings:

  - You are about to drop the column `customContestCategoryEnabled` on the `LeagueLimit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContestCategoryLeagueLimit" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LeagueLimit" DROP COLUMN "customContestCategoryEnabled";
