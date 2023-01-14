/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { healthRouter } from './health';
import { contestRouter } from './contest';
import { userRouter } from './user';
import { etlRouter } from './etl';
import { appSettingsRouter } from './appSettings';
import { betsRouter } from './bets/bets';
import { integrationRouter } from './integration';
import { adminRouter } from './admin';

export const appRouter = t.router({
  contest: contestRouter,
  user: userRouter,
  health: healthRouter,
  etl: etlRouter,
  appSettings: appSettingsRouter,
  bets: betsRouter,
  integration: integrationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
