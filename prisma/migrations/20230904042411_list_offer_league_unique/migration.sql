/*
  Warnings:

  - A unique constraint covering the columns `[league]` on the table `ListOffer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListOffer_league_key" ON "ListOffer"("league");
