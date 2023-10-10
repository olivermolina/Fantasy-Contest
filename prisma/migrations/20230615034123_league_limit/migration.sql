-- CreateTable
CREATE TABLE "LeagueLimit" (
    "id" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "maxStake" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minStake" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "LeagueLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueLimit_league_key" ON "LeagueLimit"("league");
