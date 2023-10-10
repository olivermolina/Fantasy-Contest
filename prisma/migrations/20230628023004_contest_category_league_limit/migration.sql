-- AlterTable
ALTER TABLE "LeagueLimit" ADD COLUMN     "customContestCategoryEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ContestCategoryLeagueLimit" (
    "id" TEXT NOT NULL,
    "contestCategoryId" TEXT NOT NULL,
    "leagueLimitId" TEXT NOT NULL,
    "allInPayoutMultiplier" DOUBLE PRECISION NOT NULL,
    "primaryInsuredPayoutMultiplier" DOUBLE PRECISION NOT NULL,
    "secondaryInsuredPayoutMultiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ContestCategoryLeagueLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContestCategoryLeagueLimit_contestCategoryId_leagueLimitId_key" ON "ContestCategoryLeagueLimit"("contestCategoryId", "leagueLimitId");

-- AddForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" ADD CONSTRAINT "ContestCategoryLeagueLimit_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" ADD CONSTRAINT "ContestCategoryLeagueLimit_leagueLimitId_fkey" FOREIGN KEY ("leagueLimitId") REFERENCES "LeagueLimit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
