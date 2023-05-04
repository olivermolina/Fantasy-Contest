import { t } from '~/server/trpc';
import joinContest from './joinContest';
import contestList from './contestList';
import listOffers from './listOffers';
import leaders from './leaders';
import getById from './getById';
import contestCategoryList from './contestCategoryList';
import contests from './contests';
import { getLeagueFantasyOffersCount } from './getLeaguesMarketCount';

export const contestRouter = t.router({
  joinContest,
  list: contestList,
  listOffers,
  leaders,
  getById,
  contestCategoryList,
  contests,
  getLeagueFantasyOffersCount,
});

export default contestRouter;
