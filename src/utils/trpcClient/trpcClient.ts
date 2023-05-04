import { createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '~/server/routers/_app';
import { trpcLinks, trpcTransformer } from '../trpc';

/**
 * Creates a TRPC client that can be used to make requests to the server from the client.
 */
export const trpcClient = () =>
  createTRPCProxyClient<AppRouter>({
    links: trpcLinks(),
    transformer: trpcTransformer,
  });
