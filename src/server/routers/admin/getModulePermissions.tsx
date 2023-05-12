import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { ModuleByCategory } from './getMenus';
import * as yup from '~/utils/yup';

export interface AdminModuleByCategoryType {
  /** Category */
  category: string;
  /** Submenus */
  modulePermissions: ModulePermission[];
}

/** Submenu type */
export interface ModulePermission {
  /** Module Id */
  moduleId: string;
  /** Label */
  label: string;
  /** Check */
  checked: boolean;
}

/**
 * Will fetch the user module permissions
 */
const getModulePermissions = adminProcedure
  .input(
    yup.object({
      userId: yup.string().required(),
    }),
  )
  .query(async ({ input }) => {
    const userId = input.userId;
    // Get all modules and user permissions
    const [appModules, userPermissions] = await prisma.$transaction([
      prisma.module.findMany({ where: { active: true } }),
      prisma.permission.findMany({ where: { userId } }),
    ]);

    // Group modules by category
    const appModuleByCategory = appModules.map(
      (appModule) =>
        ({
          category: appModule.name.split('_')[0],
          value: appModule,
        } as ModuleByCategory),
    );

    return appModuleByCategory.reduce(
      (acc: AdminModuleByCategoryType[], curr) => {
        // Check if user has permission to access this module
        const hasPermission = userPermissions.find(
          (permission) => permission.moduleId === curr.value.id,
        );
        const id = curr.value.id;
        const label = curr.value.description;
        // Check if category already exists
        const categoryIndex = acc.findIndex(
          (item) => item.category === curr.category,
        );
        const modulePermission = {
          moduleId: id,
          label,
          checked: hasPermission?.write && hasPermission?.read,
        } as ModulePermission;

        // Add modulePermission to existing category or create new category
        if (categoryIndex !== -1) {
          acc[categoryIndex]!.modulePermissions.push(modulePermission);
        } else {
          acc.push({
            category: curr.category,
            modulePermissions: [modulePermission],
          });
        }

        return acc;
      },
      [],
    );
  });

export default getModulePermissions;
