-- CreateTable
CREATE TABLE "AgentSubAdmin" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "subAdminId" TEXT,

    CONSTRAINT "AgentSubAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentSubAdmin_agentId_subAdminId_key" ON "AgentSubAdmin"("agentId", "subAdminId");

-- AddForeignKey
ALTER TABLE "AgentSubAdmin" ADD CONSTRAINT "AgentSubAdmin_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSubAdmin" ADD CONSTRAINT "AgentSubAdmin_subAdminId_fkey" FOREIGN KEY ("subAdminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
