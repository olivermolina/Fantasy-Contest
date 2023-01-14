/*
  Warnings:

  - You are about to drop the column `payoutMultiplier` on the `ContestCategory` table. All the data in the column will be lost.
  - Added the required column `stakeType` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `allInPayoutMultiplier` to the `ContestCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryInsuredPayoutMultiplier` to the `ContestCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryInsuredPayoutMultiplier` to the `ContestCategory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BetStakeType" AS ENUM ('ALL_IN', 'INSURED');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "stakeType" "BetStakeType" NOT NULL;

-- AlterTable
ALTER TABLE "ContestCategory" DROP COLUMN "payoutMultiplier",
ADD COLUMN     "allInPayoutMultiplier" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "primaryInsuredPayoutMultiplier" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "secondaryInsuredPayoutMultiplier" DOUBLE PRECISION NOT NULL;
