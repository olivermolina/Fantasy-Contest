-- CreateEnum
CREATE TYPE "AppSettingName" AS ENUM ('MAX_MATCH_DEPOSIT_AMOUNT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFirstDeposit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "referral" TEXT;

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL,
    "name" "AppSettingName" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
