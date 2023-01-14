import { appRouter } from '~/server/routers/_app';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { NextApiRequest, NextApiResponse } from 'next';
import defaultLogger from '~/utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== 'POST') {
    res.status(200).send({
      Accepted: true,
    });
    return;
  }

  const logger = defaultLogger.child({});
  const caller = appRouter.createCaller({} as any);
  try {
    const { MerchantCustomerID, NotificationType } = req?.body;
    if (MerchantCustomerID && NotificationType) {
      logger.info(`GIDX Profile notification`, {
        MerchantCustomerID,
        NotificationType,
      });

      try {
        await caller.integration.gidxProfileNotification({
          MerchantCustomerID,
          NotificationType,
        });
      } catch (e) {
        logger.error('Something went wrong!');
      }
    }

    res.status(200).send({
      Accepted: true,
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
