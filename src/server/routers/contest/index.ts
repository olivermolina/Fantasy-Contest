import { t } from '~/server/trpc';
import joinContest from './joinContest';
import contestList from './contestList';
import listOffers from './listOffers';
import leaders from './leaders';
import getById from './getById';
import contestCategoryList from './contestCategoryList';
import contests from './contests';
import { getLeagueFantasyOffersCount } from './getLeaguesMarketCount';
import listOffersByIds from './listOffersByIds';
import updateLeaguesMarketCount from './updateLeaguesMarketCount';
import updateListOffers from './updateListOffers';

export const contestRouter = t.router({
  joinContest,
  list: contestList,
  listOffers,
  listOffersByIds,
  leaders,
  getById,
  contestCategoryList,
  contests,
  getLeagueFantasyOffersCount,
  updateLeaguesMarketCount,
  updateListOffers,
});

export default contestRouter;
