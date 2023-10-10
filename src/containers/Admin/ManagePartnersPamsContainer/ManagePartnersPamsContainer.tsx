import React, { useMemo, useState } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import ManagePartnersPams, {
  ManagePartnersPamsRowModel,
} from '~/components/Pages/Admin/ManagePartnersPams/ManagePartnersPams';
import EditForm, {
  EditFormInputs,
} from '~/components/Pages/Admin/ManagePartnersPams/EditForm';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import { Dialog } from '@mui/material';
import { User, UserStatus, UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { USATimeZone } from '~/constants/USATimeZone';
import { useAppSelector } from '~/state/hooks';
import _ from 'lodash';

export const ManagePartnersPamsContainer = () => {
  const userDetails = useAppSelector((state) => state.profile.userDetails);
  const [selectedUser, setSelectedUser] =
    useState<ManagePartnersPamsRowModel | null>(null);
  const { data, isLoading, refetch } = trpc.admin.getManageUserList.useQuery();

  const { data: subAdminData } = trpc.user.users.useQuery({
    userType: UserType.SUB_ADMIN,
  });

  const mutation = trpc.admin.savePartnerPam.useMutation();

  const closeForm = () => {
    setSelectedUser(null);
  };

  const openUserForm = (user: ManagePartnersPamsRowModel) => {
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
      subAdminIds: [],
      timezone: USATimeZone['America/New_York'],
    });
  };

  const users = useMemo(
    () =>
      data?.reduce(
        (acc: ManagePartnersPamsRowModel[], user: (typeof data)[0]) => {
          const { subAdmin, agents } = user;
          const agentsWithSubAdminId =
            agents?.map((agent: (typeof agents)[0]) => ({
              ...agent,
            })) || [];

          return [
            ...acc,
            ...(subAdmin?.id !== 'unassigned' &&
            userDetails?.type === UserType.ADMIN
              ? [subAdmin]
              : []),
            ...agentsWithSubAdminId,
          ] as ManagePartnersPamsRowModel[];
        },
        [],
      ) || [],
    [data, userDetails],
  );

  const onSubmit = async (formInputs: EditFormInputs) => {
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

  const subAdminUsers = useMemo(
    () => (subAdminData || []) as unknown as User[],
    [subAdminData],
  );

  return (
    <>
      <BackdropLoading open={isLoading || mutation.isLoading} />
      <ManagePartnersPams
        users={_.uniqBy(users, 'id')}
        openUserForm={openUserForm}
        addUser={addUser}
        subAdminUsers={subAdminUsers}
      />
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onClose={closeForm}
          fullWidth
          maxWidth={'sm'}
        >
          <EditForm
            user={selectedUser}
            onSubmit={onSubmit}
            subAdminUsers={subAdminUsers}
            closeForm={closeForm}
          />
        </Dialog>
      )}
    </>
  );
};
