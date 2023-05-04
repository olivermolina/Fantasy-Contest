-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_subAdminId_fkey";

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "subAdminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_subAdminId_fkey" FOREIGN KEY ("subAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
