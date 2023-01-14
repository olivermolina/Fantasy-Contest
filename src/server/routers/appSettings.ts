import { t } from '../trpc';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';

export const appSettingsRouter = t.router({
  list: t.procedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const appSettings = await prisma.appSettings.findMany();
    if (!appSettings) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }
    return appSettings;
  }),
  banners: t.procedure.query(async () => {
    const banners = await prisma.banner.findMany({
      orderBy: {
        priority: 'asc',
      },
    });
    return banners;
  }),
});
