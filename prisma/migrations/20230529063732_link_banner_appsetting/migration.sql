/*
  Warnings:

  - A unique constraint covering the columns `[appSettingId]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "appSettingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Banner_appSettingId_key" ON "Banner"("appSettingId");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_appSettingId_fkey" FOREIGN KEY ("appSettingId") REFERENCES "AppSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
