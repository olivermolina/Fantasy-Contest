import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';

const leagueCategories = adminProcedure.query(async () => {
  return await prisma.leagueCategory.findMany({
    orderBy: {
      order: 'asc',
    },
  });
});

export default leagueCategories;
