import { appRouter } from '~/server/routers/_app';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { NextApiRequest, NextApiResponse } from 'next';
import defaultLogger from '~/utils/logger';
import { TOKEN } from '~/constants/TOKEN';
import { Market } from '~/lib/ev-analytics/IOddsResponse';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logger = defaultLogger.child({});
  logger.info(`gradeManualOffers handler called`);
  try {
    const caller = appRouter.createCaller({} as any);
    // Get all offers with pending bets and grade if status is Final
    const manualOffers = await caller.bets.getManualOffersWithPendingBets({
      token: TOKEN,
    });

    for (const offer of manualOffers) {
      if (offer.status === 'Final') {
        void caller.bets.grade({
          markets: offer.markets.map((market: unknown) => market as Market),
          token: TOKEN,
        });
      }
    }

    res.status(200).send({
      code: 'success',
      message: 'Grade manual offers completed!',
    });
  } catch (cause) {
    // If this a tRPC error, we can extract additional information.
    if (cause instanceof TRPCError) {
      // We can get the specific HTTP status code coming from tRPC (e.g. 404 for `NOT_FOUND`).
      const httpStatusCode = getHTTPStatusCodeFromError(cause);

      res.status(httpStatusCode).json({ error: { message: cause.message } });
      return;
    }

    // This is not a tRPC error, so we don't have specific information.
    res.status(500).json({
      error: { message: `Something went wrong when trying to connect.` },
    });
  }
}

export default handler;
