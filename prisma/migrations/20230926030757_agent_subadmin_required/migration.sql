/*
  Warnings:

  - Made the column `subAdminId` on table `AgentSubAdmin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AgentSubAdmin" ALTER COLUMN "subAdminId" SET NOT NULL;
