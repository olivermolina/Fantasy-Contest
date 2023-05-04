import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { adminProcedure } from './middleware/isAdmin';

const teams = adminProcedure
  .input(
    yup.object({
      filterName: yup.string(),
      skip: yup.number(),
      take: yup.number(),
    }),
  )
  .query(async ({ input }) => {
    const { skip, take } = input;
    return await prisma.team.findMany({
      skip: skip || 0,
      take: take || 1000,
      where: {
        name: {
          contains: input.filterName,
          mode: 'insensitive',
        },
      },
    });
  });

export default teams;
