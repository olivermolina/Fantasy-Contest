-- AlterEnum
ALTER TYPE "ModuleName" ADD VALUE 'FIGURES_VIEW_PICKS_BY_USER';

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;