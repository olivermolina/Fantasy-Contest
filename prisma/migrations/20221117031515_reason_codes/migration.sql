/*
  Warnings:

  - The `reasonCodes` column on the `SessionResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SessionResponse" DROP COLUMN "reasonCodes",
ADD COLUMN     "reasonCodes" TEXT[];
