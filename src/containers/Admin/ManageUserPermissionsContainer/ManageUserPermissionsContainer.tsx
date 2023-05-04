import React, { useState } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import ManageUserPermissions, {
  ManageAgentRowModel,
} from '~/components/Pages/Admin/ManageUserPermissions/ManageUserPermissions';
import { UserPermissionFormContainer } from './UserPermissionFormContainer';
import { useAppSelector } from '~/state/hooks';

export const ManageUserPermissionsContainer = () => {
  const userDetails = useAppSelector((state) => state.profile.userDetails);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManageAgentRowModel | null>(
    null,
  );
  const { data, isLoading } = trpc.admin.getManageUserList.useQuery();
  const handleClose = () => {
    setOpenPermissionDialog(false);
  };

  const handleOpenManagePermission = (user: ManageAgentRowModel) => {
    setSelectedUser(user);
    setOpenPermissionDialog(true);
  };

  return (
    <>
      <BackdropLoading open={isLoading} />
      <div className={'flex flex-col gap-2'}>
        {data
          ?.filter((user) => user.subAdmin)
          .map((user) => (
            <ManageUserPermissions
              key={user.subAdmin.id}
              {...user}
              handleOpenManagePermission={handleOpenManagePermission}
              user={userDetails}
            />
          ))}
      </div>
      {selectedUser && (
        <UserPermissionFormContainer
          user={selectedUser}
          open={openPermissionDialog}
          handleClose={handleClose}
        />
      )}
    </>
  );
};
