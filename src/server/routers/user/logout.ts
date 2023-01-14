import { t } from '~/server/trpc';
import { supabase } from '~/utils/supabaseClient';
import { TRPCError } from '@trpc/server';
import { setCookie } from 'cookies-next';

const logout = t.procedure.mutation(async ({ ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This user is already signed out.',
    });
  }
  setCookie('sb-access-token', '', {
    req: ctx.req,
    res: ctx.res,
    maxAge: -1,
  });
  setCookie('sb-refresh-token', '', {
    req: ctx.req,
    res: ctx.res,
    maxAge: -1,
  });
  return await supabase.auth.signOut();
});

export default logout;
