import { t } from '~/server/trpc';
import offers from './offers';
import teams from './teams';
import upsertTeam from './upsertTeam';
import upsertOffer from './upsertOffer';
import upsertPlayer from './upsertPlayer';
import upsertMarket from './upsertMarket';
import markets from './markets';
import players from './players';
import deleteMarket from './deleteMarket';

export const adminRouter = t.router({
  offers,
  teams,
  upsertTeam,
  upsertPlayer,
  upsertOffer,
  upsertMarket,
  markets,
  players,
  deleteMarket,
});

export default adminRouter;
