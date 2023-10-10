-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "League" ADD VALUE 'CSGO';
ALTER TYPE "League" ADD VALUE 'NASCAR';
ALTER TYPE "League" ADD VALUE 'F1';
ALTER TYPE "League" ADD VALUE 'KBO';
ALTER TYPE "League" ADD VALUE 'BOXING';
ALTER TYPE "League" ADD VALUE 'DOTA2';
ALTER TYPE "League" ADD VALUE 'LOL';
ALTER TYPE "League" ADD VALUE 'COD';
ALTER TYPE "League" ADD VALUE 'VALORANT';
ALTER TYPE "League" ADD VALUE 'USFL';
ALTER TYPE "League" ADD VALUE 'WNBA';
ALTER TYPE "League" ADD VALUE 'CRICKET';
ALTER TYPE "League" ADD VALUE 'NBA1H';
ALTER TYPE "League" ADD VALUE 'NBA1Q';
