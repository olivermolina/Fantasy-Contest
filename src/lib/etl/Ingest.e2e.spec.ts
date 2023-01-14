import { prisma } from '~/server/prisma';
import { LeagueEnum } from '../ev-analytics/EVAnaltyics';
import { ingest } from './Ingest';
import { getDataResponse } from './__mocks__/getData.mock';
import { getLookupsMock } from './__mocks__/getLookups.mock';

jest.mock('~/utils/logger', () => ({
  __esModule: true,
  default: {
    child: () => ({
      info: jest.fn(),
      startTimer: () => ({
        done: jest.fn(),
      }),
    }),
  },
}));

it('should properly create offers / markets given the data', async () => {
  await ingest([LeagueEnum.NFL], {
    offers: true,
    markets: true,
    initialData: getDataResponse,
    initialLookup: getLookupsMock,
  });
  const markets = await prisma.market.findMany();
  expect(markets.length).toBeGreaterThan(1);
});
