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
import { Agent, User, UserStatus, UserType } from '@prisma/client';
import { NEW_USER_ID } from '~/constants/NewUserId';
import { USATimeZone } from '~/constants/USATimeZone';
import { useAppSelector } from '~/state/hooks';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const ManageUsersContainer = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const userDetails = useAppSelector((state) => state.profile.userDetails);
  const [selectedUser, setSelectedUser] = useState<ManageUserRowModel | null>(
    null,
  );
  const { data, isLoading, refetch } = trpc.user.users.useQuery();
  const { data: partnersData } = trpc.admin.getManageUserList.useQuery();

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
      status: UserStatus.ACTIVE,
      phone: '',
      DOB: new Date(),
      firstname: '',
      lastname: '',
      referral: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      isFirstDeposit: false,
      created_at: new Date(),
      timezone: USATimeZone['America/New_York'],
      type: UserType.PLAYER,
      exemptedReasonCodes: [],
      agentId: null,
    });
  };
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

  const users = useMemo(
    () =>
      data?.reduce((acc: ManageUserRowModel[], user) => {
        const { phone, ...fields } = user;
        return [
          ...acc,
          { ...fields, phone: phone?.toString() },
        ] as ManageUserRowModel[];
      }, []) || [],
    [data],
  );

  const partners = useMemo(
    () =>
      partnersData?.flatMap(
        (row) =>
          row.agents as unknown as (User & {
            UserAsAgents: Agent[];
          })[],
      ) || [],
    [partnersData],
  );

  return (
    <>
      <BackdropLoading open={isLoading || mutation.isLoading} />
      <ManageUsers
        users={users}
        openUserForm={openUserForm}
        addUser={addUser}
        partners={partners}
      />
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          fullScreen={!matches}
          fullWidth
          maxWidth={'md'}
          sx={{ top: 65 }}
        >
          <UserForm
            user={selectedUser}
            partners={partners}
            onSubmit={onSubmit}
            closeForm={closeForm}
            userType={userDetails?.type}
          />
        </Dialog>
      )}
    </>
  );
};
