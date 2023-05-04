/*
  Warnings:

  - Added the required column `subAdminId` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "subAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_subAdminId_fkey" FOREIGN KEY ("subAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
