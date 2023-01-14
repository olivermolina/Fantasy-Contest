/*
  Warnings:

  - Added the required column `entryFee` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrize` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "entryFee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalPrize" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "Wallets" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "userId" TEXT NOT NULL,
    "contestsId" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
