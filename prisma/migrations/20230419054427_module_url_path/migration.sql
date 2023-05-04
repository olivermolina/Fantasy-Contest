-- AlterEnum
ALTER TYPE "ModuleName" ADD VALUE 'MANAGEMENT_APPSETTINGS';

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "urlPath" TEXT;
