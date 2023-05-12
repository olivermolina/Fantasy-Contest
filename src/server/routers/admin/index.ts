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
import { weeklyBalances } from './figures';
import { setUserLimits } from './setUserLimits';
import { playerStats } from './playerStats';
import { adminProcedure } from './middleware/isAdmin';
import prisma from '~/server/prisma';
import { z } from 'zod';
import { AppSettingName } from '@prisma/client';
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
import savePartnerPam from './savePartnerPam';
import usersBetLists from './usersBetLists';

/**
 * NOTE: All these procedures should use the adminProcedure as a base.
 * @see './middleware/isAdmin.ts'
 */
export const adminRouter = t.router({
  offers,
  teams,
  upsertTeam,
  upsertPlayer,
  upsertOffer,
  upsertMarket,
  markets,
  players,
  deleteMarket,
  usersBalance,
  addCredit,
  getPendingBets,
  settlePendingBet,
  weeklyBalances,
  setUserLimits,
  playerStats,
  removeUserLimits: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input: { userId } }) => {
      return prisma.userAppSettings.deleteMany({
        where: {
          userId,
          name: {
            in: [AppSettingName.MAX_BET_AMOUNT, AppSettingName.MIN_BET_AMOUNT],
          },
        },
      });
    }),
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
  savePartnerPam,
  usersBetLists,
});

export default adminRouter;
