-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WIN', 'LOSS', 'PUSH');

-- CreateEnum
CREATE TYPE "BetType" AS ENUM ('TEASER', 'STRAIGHT', 'PARLAY');

-- CreateEnum
CREATE TYPE "BetLegType" AS ENUM ('OVER_ODDS', 'UNDER_ODDS', 'SPREAD_AWAY_ODDS', 'SPREAD_HOME_ODDS', 'MONEYLINE_AWAY_ODDS', 'MONEYLINE_HOME_ODDS');

-- CreateEnum
CREATE TYPE "League" AS ENUM ('NFL', 'MLB', 'NBA', 'NCAAB', 'NCAAF', 'NHL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Scheduled', 'InProgress', 'Final', 'PostponedCanceled');

-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('GM', 'GP', 'PP');

-- CreateEnum
CREATE TYPE "MarketResult" AS ENUM ('One', 'Zero', 'Null');

-- CreateEnum
CREATE TYPE "ContestType" AS ENUM ('MATCH', 'FANTASY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "state" TEXT,
    "phone" INTEGER,
    "DOB" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestEntry" (
    "id" TEXT NOT NULL,
    "tokens" DECIMAL(65,30) NOT NULL,
    "userId" TEXT NOT NULL,
    "contestsId" TEXT NOT NULL,

    CONSTRAINT "ContestEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetLeg" (
    "id" TEXT NOT NULL,
    "type" "BetLegType" NOT NULL,
    "odds" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "spreadHomeLine" INTEGER NOT NULL,
    "spreadAwayLine" INTEGER NOT NULL,
    "offersId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetLeg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "stake" DECIMAL(10,2) NOT NULL,
    "status" "BetStatus" NOT NULL,
    "payout" DECIMAL(10,2) NOT NULL,
    "type" "BetType" NOT NULL,
    "legs" JSONB NOT NULL DEFAULT '"[]"',
    "odds" INTEGER NOT NULL,
    "contestEntriesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "bgImageUrl" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "teamid" INTEGER NOT NULL,
    "team" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "type" "MarketType" NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamAbbrev" TEXT NOT NULL,
    "offline" BOOLEAN NOT NULL,
    "spread" DOUBLE PRECISION,
    "spread_odd" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "over" DOUBLE PRECISION,
    "under" DOUBLE PRECISION,
    "moneyline" DOUBLE PRECISION,
    "spread_bet" DOUBLE PRECISION,
    "spread_cash" DOUBLE PRECISION,
    "over_bet" DOUBLE PRECISION,
    "under_bet" DOUBLE PRECISION,
    "over_cash" DOUBLE PRECISION,
    "under_cash" DOUBLE PRECISION,
    "moneyline_bet" DOUBLE PRECISION,
    "moneyline_cash" DOUBLE PRECISION,
    "spread_result" "MarketResult" NOT NULL,
    "spread_stat" DOUBLE PRECISION,
    "over_result" "MarketResult" NOT NULL,
    "under_result" "MarketResult" NOT NULL,
    "total_stat" DOUBLE PRECISION,
    "moneyline_result" "MarketResult" NOT NULL,
    "moneyline_stat" DOUBLE PRECISION,
    "offerId" TEXT,
    "teamId" INTEGER,
    "playerId" INTEGER,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "gid" TEXT NOT NULL,
    "league" "League" NOT NULL,
    "gamedate" TEXT NOT NULL,
    "epoch" INTEGER NOT NULL,
    "start_utc" TEXT,
    "end_utc" TEXT,
    "inplay" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "matchup" TEXT NOT NULL,
    "gametime" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("gid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "ContestEntry" ADD CONSTRAINT "ContestEntry_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestEntry" ADD CONSTRAINT "ContestEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetLeg" ADD CONSTRAINT "BetLeg_offersId_fkey" FOREIGN KEY ("offersId") REFERENCES "Offer"("gid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestEntriesId_fkey" FOREIGN KEY ("contestEntriesId") REFERENCES "ContestEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("gid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
