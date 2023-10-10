-- CreateTable
CREATE TABLE "BonusCreditLimit" (
    "id" TEXT NOT NULL,
    "contestCategoryId" TEXT NOT NULL,
    "bonusCreditLimitsEntabled" BOOLEAN DEFAULT false,
    "stakeTypeOptions" "BetStakeType"[],
    "bonusCreditFreeEntryEquivalent" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "BonusCreditLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBonusCreditLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestCategoryId" TEXT NOT NULL,
    "bonusCreditLimitsEntabled" BOOLEAN DEFAULT false,
    "stakeTypeOptions" "BetStakeType"[],
    "bonusCreditFreeEntryEquivalent" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "UserBonusCreditLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BonusCreditLimit_contestCategoryId_key" ON "BonusCreditLimit"("contestCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBonusCreditLimit_userId_contestCategoryId_key" ON "UserBonusCreditLimit"("userId", "contestCategoryId");

-- AddForeignKey
ALTER TABLE "BonusCreditLimit" ADD CONSTRAINT "BonusCreditLimit_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBonusCreditLimit" ADD CONSTRAINT "UserBonusCreditLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBonusCreditLimit" ADD CONSTRAINT "UserBonusCreditLimit_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
