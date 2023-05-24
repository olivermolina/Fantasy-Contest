import * as z from 'zod';

export const UserPermissionFormValidationSchema = z.object({
  userId: z.string().min(1),
  userPermissions: z.array(
    z.object({
      category: z.string().min(1),
      modulePermissions: z.array(
        z.object({
          moduleId: z.string().min(1),
          label: z.string(),
          checked: z.boolean(),
        }),
      ),
    }),
  ),
});
