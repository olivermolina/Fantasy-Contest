/*
  Warnings:

  - A unique constraint covering the columns `[marketOverrideId]` on the table `Market` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "marketOverrideId" TEXT;

-- CreateTable
CREATE TABLE "MarketOverride" (
    "id" TEXT NOT NULL,
    "total" DOUBLE PRECISION,
    "over" DOUBLE PRECISION,
    "under" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_marketOverrideId_key" ON "Market"("marketOverrideId");

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_marketOverrideId_fkey" FOREIGN KEY ("marketOverrideId") REFERENCES "MarketOverride"("id") ON DELETE SET NULL ON UPDATE CASCADE;
