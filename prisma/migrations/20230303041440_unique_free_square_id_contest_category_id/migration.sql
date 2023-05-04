/*
  Warnings:

  - A unique constraint covering the columns `[freeSquareId,contestCategoryId]` on the table `FreeSquareContestCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FreeSquareContestCategory_freeSquareId_contestCategoryId_key" ON "FreeSquareContestCategory"("freeSquareId", "contestCategoryId");
