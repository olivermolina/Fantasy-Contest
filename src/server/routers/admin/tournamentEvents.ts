import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import dayjs from 'dayjs';

const tournamentEvents = adminProcedure
  .input(
    yup.object({
      from: yup.date().required(),
      to: yup.date().required(),
    }),
  )
  .query(async ({ input }) => {
    const startDate = dayjs.tz(input.from, 'America/New_York').toDate();
    const endDate = dayjs.tz(input.to, 'America/New_York').toDate();
    endDate.setDate(endDate.getDate() + 1);
    return await prisma.tournamentEvent.findMany({
      orderBy: {
        created_at: 'desc',
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        Offers: {
          include: {
            markets: {
              include: {
                team: true,
                player: {
                  include: {
                    Team: true,
                  },
                },
              },
            },
            home: true,
            away: true,
          },
        },
      },
    });
  });

export default tournamentEvents;
