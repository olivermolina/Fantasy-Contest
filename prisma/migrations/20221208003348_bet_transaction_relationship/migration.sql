/*
  Warnings:

  - A unique constraint covering the columns `[betId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "betId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_betId_key" ON "Transaction"("betId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
