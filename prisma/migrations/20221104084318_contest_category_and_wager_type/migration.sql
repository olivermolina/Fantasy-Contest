/*
  Warnings:

  - Added the required column `contestCategoryId` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContestWagerType" AS ENUM ('TOKEN', 'CASH');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "contestCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "wagerType" "ContestWagerType" NOT NULL DEFAULT 'TOKEN';

-- CreateTable
CREATE TABLE "ContestCategory" (
    "id" TEXT NOT NULL,
    "numberOfPicks" INTEGER NOT NULL,
    "payoutMultiplier" INTEGER NOT NULL,

    CONSTRAINT "ContestCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
