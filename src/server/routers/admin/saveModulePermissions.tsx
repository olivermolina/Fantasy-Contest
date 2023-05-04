import { adminProcedure } from './middleware/isAdmin';
import { UserPermissionFormValidationSchema } from '~/components/Pages/Admin/ManageUserPermissions/UserPermissionsForm';
import prisma from '~/server/prisma';
import { ModulePermission } from '~/server/routers/admin/getModulePermissions';

/**
 * Will save the user module permissions
 */
const saveModulePermissions = adminProcedure
  .input(UserPermissionFormValidationSchema)
  .mutation(async ({ input }) => {
    const combinedModulePermissions: ModulePermission[] =
      input.userPermissions.reduce((acc: ModulePermission[], permission) => {
        return [...acc, ...permission.modulePermissions];
      }, []);

    return await prisma.$transaction(
      combinedModulePermissions.map((permission) =>
        prisma.permission.upsert({
          create: {
            moduleId: permission.moduleId,
            userId: input.userId,
            read: permission.checked,
            write: permission.checked,
          },
          update: {
            moduleId: permission.moduleId,
            userId: input.userId,
            read: permission.checked,
            write: permission.checked,
          },
          where: {
            moduleId_userId: {
              moduleId: permission.moduleId,
              userId: input.userId,
            },
          },
        }),
      ),
    );
  });

export default saveModulePermissions;
