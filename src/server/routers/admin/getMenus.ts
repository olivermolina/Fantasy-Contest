import { prisma } from '~/server/prisma';
import { adminProcedure } from './middleware/isAdmin';
import { Module as AppModule, UserType } from '@prisma/client';
import { UrlPaths } from '~/constants/UrlPaths';

/** Module by category */
export interface ModuleByCategory {
  /** Category */
  category: string;
  /** Module */
  value: AppModule;
}

/** Admin menu type */
export interface AdminMenuType {
  /** Category */
  category: string;
  /** Submenus */
  subMenus: SubmenuType[];
}

/** Submenu type */
interface SubmenuType {
  /** Id */
  id: string;
  /** Label */
  label: string;
  /** Url path */
  urlPath: string;
}

/**
 * Will fetch the available admin menus for the user.
 */
const getMenus = adminProcedure.query(async ({ ctx }) => {
  const user = ctx.user;
  // Get all modules and user permissions
  const [appModules, userPermissions] = await prisma.$transaction([
    prisma.module.findMany(),
    prisma.permission.findMany({ where: { userId: user.id } }),
  ]);

  // Group modules by category
  const appModuleByCategory = appModules.map(
    (appModule) =>
      ({
        category: appModule.name.split('_')[0],
        value: appModule,
      } as ModuleByCategory),
  );

  return appModuleByCategory.reduce((acc: AdminMenuType[], curr) => {
    // Check if user has permission to access this module
    const hasPermission = userPermissions.some(
      (permission) =>
        permission.moduleId === curr.value.id &&
        permission.read &&
        permission.write,
    );

    // Add Admin menu if user has permission or is an admin
    if (hasPermission || user.type === UserType.ADMIN) {
      const id = curr.value.id;
      const label = curr.value.description;
      const urlPath =
        UrlPaths[curr.value.urlPath as keyof typeof UrlPaths] || UrlPaths.Admin;
      const subMenu = { id, label, urlPath } as SubmenuType;
      // Check if category already exists
      const categoryIndex = acc.findIndex(
        (item) => item.category === curr.category,
      );

      // Add subMenu to existing category or create new category
      if (categoryIndex !== -1) {
        acc[categoryIndex]!.subMenus.push(subMenu);
      } else {
        acc.push({
          category: curr.category,
          subMenus: [subMenu],
        });
      }
    }

    return acc;
  }, []);
});

export default getMenus;
