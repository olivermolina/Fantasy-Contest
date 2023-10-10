/*
  Warnings:

  - A unique constraint covering the columns `[category,league]` on the table `MarketCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MarketCategory_category_key";

-- CreateIndex
CREATE UNIQUE INDEX "MarketCategory_category_league_key" ON "MarketCategory"("category", "league");
