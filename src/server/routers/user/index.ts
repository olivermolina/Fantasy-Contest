import { t } from '~/server/trpc';
import accountDeposit from './accountDeposit';
import accountPayout from './accountPayout';
import accountVerify from './accountVerify';
import accountRegister from './accountRegister';
import userDetails from './userDetails';
import checkReferral from './checkReferral';
import login from './login';
import signUp from './signUp';
import createMerchantTransaction from './createMerchantTransaction';
import accountSavePaymentMethod from './accountSavePaymentMethod';
import logout from './logout';
import userTotalBalance from './userTotalBalance';
import users from './users';
import contactUs from './contactUs';
import passwordReset from './passwordReset';
import passwordUpdate from './passwordUpdate';
import passwordResetTokenVerify from './passwordResetTokenVerify';
import transactionHistory from './transactionHistory';
import addRemoveWithdrawable from './addRemoveWithdrawable';
import getWithdrawBonusCreditOfferChances from './getWithdrawBonusCreditOfferChances';
import addWithdrawBonusCredit from './addWithdrawBonusCredit';
import syncSendGridContacts from './syncSendGridContacts';

export const userRouter = t.router({
  accountDeposit,
  accountPayout,
  accountRegister,
  accountVerify,
  userDetails,
  checkReferral,
  login,
  signUp,
  createMerchantTransaction,
  accountSavePaymentMethod,
  logout,
  userTotalBalance,
  users,
  contactUs,
  passwordReset,
  passwordUpdate,
  passwordResetTokenVerify,
  transactionHistory,
  addRemoveWithdrawable,
  getWithdrawBonusCreditOfferChances,
  addWithdrawBonusCredit,
  syncSendGridContacts,
});

export default userRouter;
