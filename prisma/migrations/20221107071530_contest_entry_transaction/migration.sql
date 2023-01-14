-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "contestEntryId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contestEntryId_fkey" FOREIGN KEY ("contestEntryId") REFERENCES "ContestEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
