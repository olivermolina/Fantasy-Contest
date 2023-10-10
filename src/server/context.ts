/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const supabaseServerClient = createPagesServerClient({
    req: opts.req,
    res: opts.res,
  });

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return {
    ...opts,
    session: {
      user,
    },
  };
}
