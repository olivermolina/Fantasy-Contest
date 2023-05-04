-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppSettingName" ADD VALUE 'NUMBER_OF_PLAYERS_FREE_ENTRY';
ALTER TYPE "AppSettingName" ADD VALUE 'STAKE_TYPE_FREE_ENTRY';
