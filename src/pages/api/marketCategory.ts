import { appRouter } from '~/server/routers/_app';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { NextApiRequest, NextApiResponse } from 'next';
import defaultLogger from '~/utils/logger';
import { League } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logger = defaultLogger.child({});
  const caller = appRouter.createCaller({} as any);
  try {
    for (const league of Object.keys(League)) {
      logger.info(`Running populate market categories for ${league}`);
      caller.admin.populateMarketCategories({ league: league as League });
    }
    logger.info(`Populate market categories done!`);

    res.status(200).send({
      code: 'Success!',
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
