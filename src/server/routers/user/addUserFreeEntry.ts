import prisma from '~/server/prisma';
import { AppSettingName, TransactionType } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import createTransaction from '~/server/routers/bets/createTransaction';

export const addUserFreeEntry = async (userId: string) => {
  const appSetting = await prisma.appSettings.findFirst({
    where: {
      name: AppSettingName.BONUS_CREDIT_FREE_ENTRY_EQUIVALENT,
    },
  });
  if (appSetting) {
    await createTransaction({
      userId,
      amountProcess: 0,
      amountBonus: Number(appSetting?.value),
      actionType: ActionType.ADD_FREE_CREDIT,
      transactionType: TransactionType.CREDIT,
    });
  }
  return 'Successfully added user free entry.';
};
