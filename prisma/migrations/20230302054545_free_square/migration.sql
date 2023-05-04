/*
  Warnings:

  - A unique constraint covering the columns `[freeSquareId]` on the table `Market` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "freeSquareId" TEXT;

-- CreateTable
CREATE TABLE "FreeSquare" (
    "id" TEXT NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreeSquare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeSquareContestCategory" (
    "id" TEXT NOT NULL,
    "freeSquareId" TEXT NOT NULL,
    "contestCategoryId" TEXT NOT NULL,

    CONSTRAINT "FreeSquareContestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_freeSquareId_key" ON "Market"("freeSquareId");

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_freeSquareId_fkey" FOREIGN KEY ("freeSquareId") REFERENCES "FreeSquare"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeSquareContestCategory" ADD CONSTRAINT "FreeSquareContestCategory_freeSquareId_fkey" FOREIGN KEY ("freeSquareId") REFERENCES "FreeSquare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeSquareContestCategory" ADD CONSTRAINT "FreeSquareContestCategory_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
