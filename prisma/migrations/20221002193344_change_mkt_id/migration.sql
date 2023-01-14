/*
  Warnings:

  - The primary key for the `Market` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `sel_id` on table `Market` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Market_id_sel_id_key";

-- AlterTable
ALTER TABLE "Market" DROP CONSTRAINT "Market_pkey",
ALTER COLUMN "sel_id" SET NOT NULL,
ADD CONSTRAINT "Market_pkey" PRIMARY KEY ("id", "sel_id");
