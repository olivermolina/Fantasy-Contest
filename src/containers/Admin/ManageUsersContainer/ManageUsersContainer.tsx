import React, { useMemo, useState } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import ManageUsers, {
  ManageUserRowModel,
} from '~/components/Pages/Admin/ManageUsers/ManageUsers';
import UserForm, {
  UserFormInputs,
} from '~/components/Pages/Admin/ManageUsers/UserForm';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import { Dialog } from '@mui/material';
import { UserStatus, UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';

export const ManageUsersContainer = () => {
  const [selectedUser, setSelectedUser] = useState<ManageUserRowModel | null>(
    null,
  );
  const { data, isLoading, refetch } = trpc.admin.getManageUserList.useQuery();

  const mutation = trpc.admin.saveUser.useMutation();

  const closeForm = () => {
    setSelectedUser(null);
  };

  const openUserForm = (user: ManageUserRowModel) => {
    setSelectedUser(user);
  };

  const addUser = () => {
    openUserForm({
      id: NEW_USER_ID,
      username: '',
      password: '',
      email: '',
      phone: '',
      type: UserType.AGENT,
      status: UserStatus.ACTIVE,
      subAdminId: '',
    });
  };

  const users = useMemo(
    () =>
      data?.reduce((acc: ManageUserRowModel[], user) => {
        const { subAdmin, agents } = user;
        const agentsWithSubAdminId = agents.map((agent) => ({
          ...agent,
          subAdminId: subAdmin?.id,
        }));

        return [
          ...acc,
          ...(subAdmin.id !== 'unassigned' ? [subAdmin] : []),
          ...agentsWithSubAdminId,
        ] as ManageUserRowModel[];
      }, []) || [],
    [data],
  );

  const onSubmit = async (formInputs: UserFormInputs) => {
    try {
      await mutation.mutateAsync(formInputs);
      closeForm();
      await refetch();
      toast.success(`Saved successfully!`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };

  return (
    <>
      <BackdropLoading open={isLoading || mutation.isLoading} />
      <div className={'flex flex-col gap-2'}>
        <ManageUsers
          users={users}
          openUserForm={openUserForm}
          addUser={addUser}
        />
      </div>
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onClose={closeForm}
          fullWidth
          maxWidth={'sm'}
        >
          <UserForm
            user={selectedUser}
            onSubmit={onSubmit}
            subAdminUsers={users.filter(
              (user) => user.type === UserType.SUB_ADMIN,
            )}
            closeForm={closeForm}
          />
        </Dialog>
      )}
    </>
  );
};
