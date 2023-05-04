/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `AppSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppSettingName" ADD VALUE 'MIN_BET_AMOUNT';
ALTER TYPE "AppSettingName" ADD VALUE 'MAX_BET_AMOUNT';

-- AlterTable
ALTER TABLE "AppSettings" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_userId_name_key" ON "AppSettings"("userId", "name");

-- AddForeignKey
ALTER TABLE "AppSettings" ADD CONSTRAINT "AppSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
