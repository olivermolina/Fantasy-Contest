/*
  Warnings:

  - You are about to drop the column `userId` on the `AppSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AppSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AppSettings" DROP CONSTRAINT "AppSettings_userId_fkey";

-- DropIndex
DROP INDEX "AppSettings_userId_name_key";

-- AlterTable
ALTER TABLE "AppSettings" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_name_key" ON "AppSettings"("name");
