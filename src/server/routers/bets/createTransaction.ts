import ShortUniqueId from 'short-unique-id';
import { prisma } from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType, TransactionType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';

interface CreateTransactionInput {
  transactionId?: string;
  userId: string;
  amountProcess: number;
  amountBonus: number;
  contestEntryId?: string;
  transactionType: TransactionType;
  actionType: ActionType;
  betId?: string;
}

export const createTransaction = async (input: CreateTransactionInput) => {
  try {
    const {
      userId,
      amountProcess,
      amountBonus,
      contestEntryId,
      transactionType,
      actionType,
      betId,
    } = input;

    if (!input.transactionId) {
      const session = await prisma.session.create({
        data: {
          userId: userId,
          serviceType: actionType,
          deviceLocation: '',
          sessionRequestRaw: '',
        },
      });
      const uid = new ShortUniqueId({ length: 16 });
      await prisma.transaction.create({
        data: {
          id: uid(),
          sessionId: session.id,
          actionType: actionType,
          userId: userId,
          amountProcess,
          amountBonus: amountBonus,
          transactionCurrency: 'USD',
          contestEntryId,
          betId,
          TransactionStatuses: {
            create: [
              {
                statusCode: 1, // Mark as complete
                statusMessage: `${transactionType} transaction successfully created`,
                transactionType,
                transactionScore: 0,
                transactionMethod: 'OTHER',
                transactionMethodType: PaymentMethodType.OTHERS,
                transactionMethodAccount: '',
                approvalDateTime: new Date(),
                statusDateTime: new Date(),
              },
            ],
          },
        },
      });
    }

    const contestEntry = await prisma.contestEntry.findUnique({
      where: {
        id: contestEntryId ?? '',
      },
    });

    const wallet = await prisma.wallets.findFirst({
      where: {
        userId: userId,
        contestsId: contestEntry?.contestsId || MORE_OR_LESS_CONTEST_ID,
      },
    });

    let updateWalletData: Prisma.XOR<
      Prisma.WalletsUpdateInput,
      Prisma.WalletsUncheckedUpdateInput
    > = {
      userId,
    };

    const amountDifference = amountProcess - amountBonus;
    switch (actionType) {
      // Deposits
      case ActionType.PAY:
        updateWalletData = {
          balance: {
            increment: amountProcess + amountBonus,
          },
          cashBalance: {
            increment: amountProcess,
          },
          unPlayedAmount: {
            increment: amountProcess,
          },
          bonusCredits: {
            increment: amountBonus,
          },
        };
        break;

      // Withdrawals
      case ActionType.PAYOUT:
        updateWalletData = {
          balance: {
            decrement: Math.min(amountProcess, Number(wallet?.balance)),
          },
          cashBalance: {
            decrement: Math.min(amountProcess, Number(wallet?.cashBalance)),
          },
          amountAvailableToWithdraw: {
            decrement: Math.min(
              amountProcess,
              Number(wallet?.amountAvailableToWithdraw),
            ),
          },
        };
        break;

      // Refund a cash entry non-withdrawable
      case ActionType.CASH_CONTEST_CANCELLED:
        updateWalletData = {
          balance: {
            increment: amountProcess + amountBonus,
          },
          cashBalance: {
            increment: amountProcess,
          },
          unPlayedAmount: {
            increment: amountProcess,
          },
          bonusCredits: {
            increment: amountBonus,
          },
        };
        break;

      // Refund a cash entry withdrawable
      case ActionType.WITHDRAWABLE_CASH_CONTEST_CANCELLED:
        updateWalletData = {
          balance: {
            increment: amountProcess + amountBonus,
          },
          cashBalance: {
            increment: amountProcess,
          },
          amountAvailableToWithdraw: {
            increment: amountProcess,
          },
          bonusCredits: {
            increment: amountBonus,
          },
        };
        break;

      // Add withdrawable cash
      case ActionType.ADD_WITHDRAWABLE:
        updateWalletData = {
          balance: {
            increment: amountProcess,
          },
          cashBalance: {
            increment: amountProcess,
          },
          amountAvailableToWithdraw: {
            increment: amountProcess,
          },
        };
        break;

      // Remove withdrawable cash
      case ActionType.REMOVE_WITHDRAWABLE:
        updateWalletData = {
          // balance should not below 0 after deduction
          balance: {
            decrement: Math.min(amountProcess, Number(wallet?.balance)),
          },
          // balance should not below 0 after deduction
          cashBalance: {
            decrement: Math.min(amountProcess, Number(wallet?.cashBalance)),
          },
          // balance should not below 0 after deduction
          amountAvailableToWithdraw: {
            decrement: Math.min(
              amountProcess,
              Number(wallet?.amountAvailableToWithdraw),
            ),
          },
        };
        break;

      // Place entry
      case ActionType.PLACE_BET:
        const remainingBalance = Math.max(
          Number(wallet?.balance) - amountProcess,
          0,
        );
        updateWalletData = {
          // balance should not below 0 after deduction
          balance: {
            decrement: Math.min(amountProcess, Number(wallet?.balance)),
          },
          unPlayedAmount: {
            // balance should not below 0 after deduction
            decrement: Math.min(
              Number(wallet?.unPlayedAmount),
              amountDifference,
            ),
          },
          cashBalance: {
            // balance should not below 0
            decrement: Math.min(amountDifference, Number(wallet?.cashBalance)),
          },
          bonusCredits: {
            // balance should not below 0
            decrement: Math.min(amountBonus, Number(wallet?.bonusCredits)),
          },
          // amountAvailableToWithdraw should not greater than remaining balance
          ...(Number(wallet?.amountAvailableToWithdraw) > remainingBalance && {
            amountAvailableToWithdraw: remainingBalance,
          }),
        };
        break;

      // Winning an entry
      case ActionType.CASH_CONTEST_WIN:
        updateWalletData = {
          balance: {
            increment: amountProcess,
          },
          cashBalance: {
            increment: amountProcess,
          },
          amountAvailableToWithdraw: {
            increment: amountProcess,
          },
        };
        break;

      // Bonus credits and Referrals
      case ActionType.REFERRAL_FREE_CREDIT:
      case ActionType.ADD_FREE_CREDIT:
        updateWalletData = {
          ...(transactionType === TransactionType.CREDIT && {
            balance: {
              increment: amountProcess + amountBonus,
            },
            bonusCredits: {
              increment: amountProcess + amountBonus,
            },
          }),
          ...(transactionType === TransactionType.DEBIT && {
            balance: {
              decrement: Math.min(
                amountProcess + amountBonus,
                Number(wallet?.balance),
              ),
            },
            bonusCredits: {
              decrement: Math.min(
                amountProcess + amountBonus,
                Number(wallet?.bonusCredits),
              ),
            },
          }),
        };
        break;

      // Convert cash balance to bonus credit
      case ActionType.WITHDRAW_BONUS_CREDIT:
        updateWalletData = {
          ...(transactionType === TransactionType.CREDIT && {
            bonusCredits: {
              increment: amountProcess + amountBonus,
            },
          }),
          ...(transactionType === TransactionType.DEBIT && {
            cashBalance: {
              decrement: Math.min(
                amountProcess + amountBonus,
                Number(wallet?.cashBalance),
              ),
            },
          }),
        };
        break;
      default:
    }

    await prisma.wallets.update({
      where: {
        userId_contestsId: {
          userId: userId,
          contestsId: contestEntry?.contestsId || MORE_OR_LESS_CONTEST_ID,
        },
      },
      data: updateWalletData,
    });
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: CustomErrorMessages.ACCOUNT_TRANSACTION,
    });
  }
};

export default createTransaction;
