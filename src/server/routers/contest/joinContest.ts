import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { TransactionType } from '@prisma/client';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import { getUserTotalBalance } from '~/server/routers/user/userTotalBalance';
import applyDepositDistribution from '~/server/routers/user/applyDepositDistribution';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import { isAuthenticated } from '~/server/routers/middleware/isAuthenticated';

const joinContest = isAuthenticated
  .input(
    yup.object({
      contestId: yup.string().required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const userId = ctx.session.user?.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: CustomErrorMessages.CONTEST_REQUIRE_LOGIN,
        });
      }

      const contest = await prisma.contest.findUnique({
        where: {
          id: input.contestId,
        },
        select: {
          entryFee: true,
          startDate: true,
          ContestEntries: {
            select: {
              User: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: CustomErrorMessages.CONTEST_NOT_FOUND,
        });
      }

      if (dayjs().isAfter(dayjs(contest?.startDate))) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: CustomErrorMessages.CONTEST_LATE_ENTRY,
        });
      }
      if (
        contest?.ContestEntries.some(
          (item) => item.User.id == ctx.session.user?.id,
        )
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: CustomErrorMessages.CONTEST_DUPLICATE_ENTRY,
        });
      }

      // Verify user total cash amount
      const entryFee = Number(contest.entryFee);

      // Get user total available balance
      const { totalAmount } = await getUserTotalBalance(user.id);
      if (entryFee > totalAmount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: CustomErrorMessages.CONTEST_INSUFFICIENT_FUNDS,
        });
      }

      const contestEntry = await prisma.contestEntry.create({
        data: {
          userId: user.id,
          contestsId: input.contestId,
          // TODO: figure out how to pull this number in
          tokens: 1000,
        },
      });

      await prisma.wallets.create({
        data: {
          balance: 1000,
          userId: user.id,
          contestsId: input.contestId,
          created_by: '',
          updated_by: '',
        },
      });

      await createTransaction({
        userId: user.id,
        amountProcess: entryFee,
        amountBonus: 0,
        contestEntryId: contestEntry.id,
        transactionType: TransactionType.DEBIT,
        actionType: ActionType.JOIN_CONTEST,
      });

      await applyDepositDistribution(
        user.id,
        entryFee,
        undefined,
        contestEntry.id,
      );
    } catch (error) {
      throw error;
    }
  });

export default joinContest;
