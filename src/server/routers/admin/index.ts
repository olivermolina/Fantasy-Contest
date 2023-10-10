import { t } from '~/server/trpc';
import offers from './offers';
import teams from './teams';
import upsertTeam from './upsertTeam';
import upsertOffer from './upsertOffer';
import upsertPlayer from './upsertPlayer';
import upsertMarket from './upsertMarket';
import markets from './markets';
import players from './players';
import deleteMarket from './deleteMarket';
import usersBalance from './usersBalance';
import addCredit from './addCredit';
import getPendingBets from './getPendingBets';
import { settlePendingBet } from './settlePendingBet';
import {
  monthlyBalances,
  userPerformanceByPicks,
  userPerformanceBySport,
  userPerformanceBySportCategory,
  weeklyBalances,
} from './figures';
import { setUserLimits } from './setUserLimits';
import { playerStats } from './playerStats';
import getLineExposures from './getLineExposures';
import addFreeSquarePromotion from './addFreeSquarePromotion';
import deleteFreeSquarePromotion from './deleteFreeSquarePromotion';
import updateAppSettings from './updateAppSettings';
import getUserBonusCredits from './getUserBonusCredits';
import cancelUserBonusCredits from './cancelUserBonusCredit';
import addReferralCode from './addReferralCode';
import deleteReferralCode from './deleteReferralCode';
import sendSms from './sendSms';
import getMenus from './getMenus';
import getManageUserList from './getUserManagementList';
import getModulePermissions from './getModulePermissions';
import saveModulePermissions from './saveModulePermissions';
import saveUser from './saveUser';
import saveBanner from './saveBanner';
import savePartnerPam from './savePartnerPam';
import usersBetLists from './usersBetLists';
import overrideOffer from './overrideOffer';
import addUsersFreeEntry from './addUsersFreeEntry';
import updateBetLeg from './updateBetLeg';
import { setContestCategoryLimits } from './setContestCategoryLimits';
import tsevoBillingReport from './tsevoBillingReport';
import { setLeagueLimits } from './setLeagueLimits';
import tournamentEvents from './tournamentEvents';
import { saveTournamentEvent } from './saveTournamentEvent';
import { deleteTournamentEvent } from './deleteTournamentEvent';
import { saveTournamentEventOffer } from './saveTournamentEventOffer';
import deleteTournamentEventOffer from './deleteTournamentEventOffer';
import createSms from './createSms';
import marketCategories from './marketCategories';
import saveMarketCategory from './saveMarketCategory';
import populateMarketCategories from './populateMarketCategories';
import { userConversion } from './userConversion';
import deleteTeam from './deleteTeam';
import deletePlayer from './deletePlayer';
import saveBonusCreditLimits from './saveBonusCreditLimits';
import removeUserLimits from './removeUserLimits';
import leagueCategories from './leagueCategories';
import saveLeagueCategory from './saveLeagueCategory';
import copyTournamentEvent from './copyTournamentEvent';
import copyOffer from './copyOffer';
import deleteOffer from './deleteOffer';
import saveUserWallet from './saveUserWallet';

/**
 * NOTE: All these procedures should use the adminProcedure as a base.
 * @see './middleware/isAdmin.ts'
 */
export const adminRouter = t.router({
  /**
   * Manual offers
   */
  offers,
  teams,
  upsertTeam,
  deleteTeam,
  upsertPlayer,
  deletePlayer,
  upsertOffer,
  copyOffer,
  deleteOffer,
  upsertMarket,
  markets,
  players,
  deleteMarket,

  /**
   * Users
   */
  usersBalance,
  addCredit,
  getPendingBets,
  settlePendingBet,
  saveUserWallet,

  /**
   * Figures
   */
  weeklyBalances,
  userPerformanceBySport,
  userPerformanceByPicks,
  userPerformanceBySportCategory,
  monthlyBalances,

  setUserLimits,
  playerStats,
  removeUserLimits,
  getLineExposures,
  updateAppSettings,
  addFreeSquarePromotion,
  deleteFreeSquarePromotion,
  getUserBonusCredits,
  cancelUserBonusCredits,
  addReferralCode,
  deleteReferralCode,
  sendSms,
  getMenus,
  getModulePermissions,
  getManageUserList,
  saveModulePermissions,
  saveUser,
  saveBanner,
  savePartnerPam,
  usersBetLists,
  overrideOffer,
  addUsersFreeEntry,
  updateBetLeg,
  setContestCategoryLimits,
  tsevoBillingReport,
  setLeagueLimits,

  /**
   * Tournament Style
   */
  tournamentEvents,
  saveTournamentEvent,
  deleteTournamentEvent,
  saveTournamentEventOffer,
  deleteTournamentEventOffer,
  copyTournamentEvent,

  createSms,
  marketCategories,
  saveMarketCategory,
  populateMarketCategories,
  userConversion,
  saveBonusCreditLimits,
  leagueCategories,
  saveLeagueCategory,
});

export default adminRouter;
