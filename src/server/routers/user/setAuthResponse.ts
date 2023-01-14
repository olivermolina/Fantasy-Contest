import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

/**
 * Will set the supabase cookies.
 * @param ctx next api context
 * @param access_token supabase access token
 * @param refresh_token supabase refresh token
 */
export function setAuthResponse(
  ctx: { req: NextApiRequest; res: NextApiResponse },
  access_token?: string,
  refresh_token?: string,
) {
  if (!access_token || !refresh_token) {
    throw new Error('Missing either access token to refresh token!');
  }
  setCookie('sb-access-token', access_token, {
    req: ctx.req,
    res: ctx.res,
    maxAge: 60 * 60 * 24,
  });
  setCookie('sb-refresh-token', refresh_token, {
    req: ctx.req,
    res: ctx.res,
    maxAge: 60 * 60 * 24,
  });
}
