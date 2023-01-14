import { t } from '../trpc';
import * as yup from '~/utils/yup';
import { LeagueEnum } from '~/lib/ev-analytics/EVAnaltyics';
import { ingest, IngestOptionsType } from '~/lib/etl/Ingest';
import { TRPCError } from '@trpc/server';
import { TOKEN } from '~/constants/TOKEN';
import logger from '~/utils/logger';

export const etlRouter = t.router({
  ingestByLeague: t.procedure
    .input(
      yup
        .object({
          league: yup
            .mixed<LeagueEnum>()
            .oneOf(Object.values(LeagueEnum))
            .required(),
          options: yup.mixed<IngestOptionsType>(),
          token: yup.string().required(),
        })
        .required(),
    )
    .query(async ({ input }) => {
      if (input.token !== TOKEN) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Token incorrect',
        });
      }
      await ingest([input.league], input.options).catch((e) => logger.error(e));
    }),
});
