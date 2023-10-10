import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import prisma from '~/server/prisma';

const marketCategories = adminProcedure.query(async () => {
  return await prisma.marketCategory.findMany();
});

export default marketCategories;
