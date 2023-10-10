/*
  Warnings:

  - You are about to drop the column `bonusCreditLimitsEntabled` on the `BonusCreditLimit` table. All the data in the column will be lost.
  - You are about to drop the column `bonusCreditLimitsEntabled` on the `UserBonusCreditLimit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BonusCreditLimit" DROP COLUMN "bonusCreditLimitsEntabled",
ADD COLUMN     "enabled" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "UserBonusCreditLimit" DROP COLUMN "bonusCreditLimitsEntabled",
ADD COLUMN     "enabled" BOOLEAN DEFAULT false;
