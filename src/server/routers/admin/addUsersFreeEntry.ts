import { prisma } from '~/server/prisma';
import { adminProcedure } from '~/server/routers/admin/middleware/isAdmin';
import { UserStatus, UserType } from '@prisma/client';
import { addUserFreeEntry } from '~/server/routers/user/addUserFreeEntry';

const addUsersFreeEntry = adminProcedure.mutation(async () => {
  const users = await prisma.user.findMany({
    where: {
      type: UserType.PLAYER,
      status: UserStatus.ACTIVE,
    },
  });
  return await Promise.all(
    users.map(async (user) => {
      await addUserFreeEntry(user.id);
    }),
  );
});

export default addUsersFreeEntry;
