/*
  Warnings:

  - Changed the type of `type` on the `Contest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "type",
ADD COLUMN     "type" "ContestType" NOT NULL;
