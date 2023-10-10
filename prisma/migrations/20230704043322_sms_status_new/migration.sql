-- AlterEnum
ALTER TYPE "SmsStatus" ADD VALUE 'NEW';

-- AlterTable
ALTER TABLE "SmsLog" ADD COLUMN     "reason" TEXT;
