-- CreateTable
CREATE TABLE "LeagueCategory" (
    "id" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "order" INTEGER,

    CONSTRAINT "LeagueCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueCategory_league_key" ON "LeagueCategory"("league");
