/*
  Warnings:

  - You are about to drop the column `legs` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `offersId` on the `BetLeg` table. All the data in the column will be lost.
  - You are about to drop the column `spreadAwayLine` on the `BetLeg` table. All the data in the column will be lost.
  - You are about to drop the column `spreadHomeLine` on the `BetLeg` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,contestsId]` on the table `Wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marketId` to the `BetLeg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketSel_id` to the `BetLeg` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BetLeg" DROP CONSTRAINT "BetLeg_offersId_fkey";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "legs";

-- AlterTable
ALTER TABLE "BetLeg" DROP COLUMN "offersId",
DROP COLUMN "spreadAwayLine",
DROP COLUMN "spreadHomeLine",
ADD COLUMN     "betId" TEXT,
ADD COLUMN     "marketId" TEXT NOT NULL,
ADD COLUMN     "marketSel_id" INTEGER NOT NULL,
ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "odds" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "Wallets_userId_contestsId_key" ON "Wallets"("userId", "contestsId");

-- AddForeignKey
ALTER TABLE "BetLeg" ADD CONSTRAINT "BetLeg_marketId_marketSel_id_fkey" FOREIGN KEY ("marketId", "marketSel_id") REFERENCES "Market"("id", "sel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetLeg" ADD CONSTRAINT "BetLeg_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
