-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_subAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_appSettingId_fkey";

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_contestCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_contestEntriesId_fkey";

-- DropForeignKey
ALTER TABLE "BetLeg" DROP CONSTRAINT "BetLeg_betId_fkey";

-- DropForeignKey
ALTER TABLE "ContestCategory" DROP CONSTRAINT "ContestCategory_bonusCreditLimitId_fkey";

-- DropForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" DROP CONSTRAINT "ContestCategoryLeagueLimit_contestCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" DROP CONSTRAINT "ContestCategoryLeagueLimit_leagueLimitId_fkey";

-- DropForeignKey
ALTER TABLE "ContestEntry" DROP CONSTRAINT "ContestEntry_contestsId_fkey";

-- DropForeignKey
ALTER TABLE "DepositDistribution" DROP CONSTRAINT "DepositDistribution_betId_fkey";

-- DropForeignKey
ALTER TABLE "DepositDistribution" DROP CONSTRAINT "DepositDistribution_contestEntryId_fkey";

-- DropForeignKey
ALTER TABLE "DepositDistribution" DROP CONSTRAINT "DepositDistribution_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "FreeSquareContestCategory" DROP CONSTRAINT "FreeSquareContestCategory_contestCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "FreeSquareContestCategory" DROP CONSTRAINT "FreeSquareContestCategory_freeSquareId_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_freeSquareId_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_marketOverrideId_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamid_fkey";

-- DropForeignKey
ALTER TABLE "SessionResponse" DROP CONSTRAINT "SessionResponse_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_betId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_contestEntryId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionStatus" DROP CONSTRAINT "TransactionStatus_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agentId_fkey";

-- DropForeignKey
ALTER TABLE "UserBonusCreditLimit" DROP CONSTRAINT "UserBonusCreditLimit_bonusCreditLimitId_fkey";

-- DropForeignKey
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_contestsId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestEntry" ADD CONSTRAINT "ContestEntry_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetLeg" ADD CONSTRAINT "BetLeg_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestEntriesId_fkey" FOREIGN KEY ("contestEntriesId") REFERENCES "ContestEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamid_fkey" FOREIGN KEY ("teamid") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("gid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_freeSquareId_fkey" FOREIGN KEY ("freeSquareId") REFERENCES "FreeSquare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_marketOverrideId_fkey" FOREIGN KEY ("marketOverrideId") REFERENCES "MarketOverride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionResponse" ADD CONSTRAINT "SessionResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contestEntryId_fkey" FOREIGN KEY ("contestEntryId") REFERENCES "ContestEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionStatus" ADD CONSTRAINT "TransactionStatus_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestCategory" ADD CONSTRAINT "ContestCategory_bonusCreditLimitId_fkey" FOREIGN KEY ("bonusCreditLimitId") REFERENCES "BonusCreditLimit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBonusCreditLimit" ADD CONSTRAINT "UserBonusCreditLimit_bonusCreditLimitId_fkey" FOREIGN KEY ("bonusCreditLimitId") REFERENCES "BonusCreditLimit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositDistribution" ADD CONSTRAINT "DepositDistribution_contestEntryId_fkey" FOREIGN KEY ("contestEntryId") REFERENCES "ContestEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_appSettingId_fkey" FOREIGN KEY ("appSettingId") REFERENCES "AppSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_subAdminId_fkey" FOREIGN KEY ("subAdminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeSquareContestCategory" ADD CONSTRAINT "FreeSquareContestCategory_freeSquareId_fkey" FOREIGN KEY ("freeSquareId") REFERENCES "FreeSquare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeSquareContestCategory" ADD CONSTRAINT "FreeSquareContestCategory_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" ADD CONSTRAINT "ContestCategoryLeagueLimit_contestCategoryId_fkey" FOREIGN KEY ("contestCategoryId") REFERENCES "ContestCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestCategoryLeagueLimit" ADD CONSTRAINT "ContestCategoryLeagueLimit_leagueLimitId_fkey" FOREIGN KEY ("leagueLimitId") REFERENCES "LeagueLimit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
