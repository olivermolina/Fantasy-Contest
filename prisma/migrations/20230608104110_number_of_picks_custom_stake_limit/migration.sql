-- AlterTable
ALTER TABLE "ContestCategory" ADD COLUMN     "customStakeLimitEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "maxStakeAmount" DECIMAL(65,30),
ADD COLUMN     "minStakeAmount" DECIMAL(65,30);
