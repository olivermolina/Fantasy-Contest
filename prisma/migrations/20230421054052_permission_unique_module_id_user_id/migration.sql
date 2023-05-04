/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,userId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_moduleId_userId_key" ON "Permission"("moduleId", "userId");
