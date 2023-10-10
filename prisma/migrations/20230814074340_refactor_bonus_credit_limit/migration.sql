/*
  Warnings:

  - You are about to drop the column `contestCategoryId` on the `BonusCreditLimit` table. All the data in the column will be lost.
  - You are about to drop the column `contestCategoryId` on the `UserBonusCreditLimit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bonusCreditLimitId]` on the table `ContestCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,bonusCreditLimitId]` on the table `UserBonusCreditLimit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bonusCreditLimitId` to the `UserBonusCreditLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BonusCreditLimit" DROP CONSTRAINT "BonusCreditLimit_contestCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserBonusCreditLimit" DROP CONSTRAINT "UserBonusCreditLimit_contestCategoryId_fkey";

-- DropIndex
DROP INDEX "BonusCreditLimit_contestCategoryId_key";

-- DropIndex
DROP INDEX "UserBonusCreditLimit_userId_contestCategoryId_key";

-- AlterTable
ALTER TABLE "BonusCreditLimit" DROP COLUMN "contestCategoryId";

-- AlterTable
ALTER TABLE "ContestCategory" ADD COLUMN     "bonusCreditLimitId" TEXT;

-- AlterTable
ALTER TABLE "UserBonusCreditLimit" DROP COLUMN "contestCategoryId",
ADD COLUMN     "bonusCreditLimitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContestCategory_bonusCreditLimitId_key" ON "ContestCategory"("bonusCreditLimitId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBonusCreditLimit_userId_bonusCreditLimitId_key" ON "UserBonusCreditLimit"("userId", "bonusCreditLimitId");

-- AddForeignKey
ALTER TABLE "ContestCategory" ADD CONSTRAINT "ContestCategory_bonusCreditLimitId_fkey" FOREIGN KEY ("bonusCreditLimitId") REFERENCES "BonusCreditLimit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBonusCreditLimit" ADD CONSTRAINT "UserBonusCreditLimit_bonusCreditLimitId_fkey" FOREIGN KEY ("bonusCreditLimitId") REFERENCES "BonusCreditLimit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
