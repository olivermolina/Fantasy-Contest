-- AlterTable
ALTER TABLE "FreeSquare" ADD COLUMN     "freeEntryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxStake" DECIMAL(65,30) NOT NULL DEFAULT 0;
