/*
  Warnings:

  - A unique constraint covering the columns `[id,sel_id]` on the table `Market` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "sel_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Market_id_sel_id_key" ON "Market"("id", "sel_id");
