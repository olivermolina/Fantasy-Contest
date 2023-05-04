-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppSettingName" ADD VALUE 'MAX_RETENTION_BONUS';
ALTER TYPE "AppSettingName" ADD VALUE 'RETENTION_BONUS_WEEKLY_CHANCE';
ALTER TYPE "AppSettingName" ADD VALUE 'RETENTION_BONUS_MATCH_MULTIPLIER';