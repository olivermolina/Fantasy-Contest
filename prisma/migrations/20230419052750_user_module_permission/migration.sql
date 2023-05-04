-- CreateEnum
CREATE TYPE "ModuleName" AS ENUM ('MANAGEMENT_INSERT_BONUS_CREDIT', 'MANAGEMENT_AMOUNT_AVAILABLE_TO_WITHDRAW', 'MANAGEMENT_MANUALLY_ENTER_OFFER_LINES', 'MANAGEMENT_BALANCE_BY_USER_ID', 'MANAGEMENT_UPDATE_USERS_LIMITS', 'MANAGEMENT_WITHDRAWAL_OFFER', 'MANAGEMENT_ADD_REMOVE_FREE_SQUARE_PROMOTIONS', 'MANAGEMENT_AGENT_REFERRAL_CODES', 'MANAGEMENT_BONUS_CREDIT_LIMITS', 'MANAGEMENT_SEND_SMS', 'FIGURES_WEEKLY_BALANCE', 'FIGURES_LINE_EXPOSURES', 'FIGURES_PLAYER_TOTALS_BY_RANGE', 'ACTION_DELETE_PICKS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserType" ADD VALUE 'ADMIN';
ALTER TYPE "UserType" ADD VALUE 'SUB_ADMIN';

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "write" BOOLEAN NOT NULL,
    "moduleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "name" "ModuleName" NOT NULL,
    "description" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
