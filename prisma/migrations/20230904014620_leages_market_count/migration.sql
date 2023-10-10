-- CreateTable
CREATE TABLE "LeaguesMarketCount" (
    "id" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "count" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaguesMarketCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaguesMarketCount_league_key" ON "LeaguesMarketCount"("league");
