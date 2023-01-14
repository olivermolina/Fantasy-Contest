/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { supabase } from '~/utils/supabaseClient';

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await supabase.auth.api.getUserByCookie(opts.req, opts.res);

  return {
    ...opts,
    session,
  };
}
