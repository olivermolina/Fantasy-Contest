-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PLAYER', 'AGENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'PLAYER';
