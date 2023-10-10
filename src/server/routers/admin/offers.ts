import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import z from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const offers = adminProcedure
  .input(
    z.object({
      limit: z.number(),
      cursor: z.string().optional(),
      from: z.date(),
      to: z.date(),
    }),
  )
  .query(async ({ input }) => {
    const limit = input.limit ?? 50;
    const { cursor, from, to } = input;

    const startDate = dayjs.tz(from, 'America/New_York').toDate();
    const endDate = dayjs.tz(to, 'America/New_York').toDate();
    endDate.setDate(endDate.getDate() + 1);

    const dateRange = {
      gte: startDate,
      lte: endDate,
    };

    const totalRowCount = await prisma.offer.count({
      where: {
        manualEntry: true,
        tournamentEventId: null,
        created_at: dateRange,
      },
    });

    const offers = await prisma.offer.findMany({
      take: limit + 1,
      cursor: cursor ? { gid: cursor } : undefined,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        manualEntry: true,
        tournamentEventId: null,
        created_at: dateRange,
      },
      include: {
        home: true,
        away: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (offers.length > limit) {
      const nextItem = offers.pop();
      nextCursor = nextItem?.gid;
    }
    return {
      offers,
      nextCursor,
      meta: {
        totalRowCount,
      },
    };
  });

export default offers;
