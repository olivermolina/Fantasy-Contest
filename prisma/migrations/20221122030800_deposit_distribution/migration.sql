/*
  Warnings:

  - The values [FTX] on the enum `PaymentMethodType` will be removed. If these variants are still used in the database, this will fail.
  - The `reasonCodes` column on the `SessionResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethodType_new" AS ENUM ('CC', 'ACH', 'Paypal', 'OTHERS');
ALTER TABLE "TransactionStatus" ALTER COLUMN "transactionMethodType" TYPE "PaymentMethodType_new" USING ("transactionMethodType"::text::"PaymentMethodType_new");
ALTER TYPE "PaymentMethodType" RENAME TO "PaymentMethodType_old";
ALTER TYPE "PaymentMethodType_new" RENAME TO "PaymentMethodType";
DROP TYPE "PaymentMethodType_old";
COMMIT;

-- AlterTable
ALTER TABLE "SessionResponse" DROP COLUMN "reasonCodes",
ADD COLUMN     "reasonCodes" TEXT[];

-- CreateTable
CREATE TABLE "DepositDistribution" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "betId" TEXT,
    "contestEntryId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepositDistribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_contestEntryId_fkey" FOREIGN KEY ("contestEntryId") REFERENCES "ContestEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
