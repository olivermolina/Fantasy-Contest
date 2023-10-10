import React from 'react';
import { trpc } from '~/utils/trpc';
import { UsersBalanceDataTable } from '~/components/Admin/UsersBalance';

const AdminUsersBalanceContainer = () => {
  const { isLoading, data } = trpc.admin.usersBalance.useQuery();

  return <UsersBalanceDataTable data={data} isLoading={isLoading} />;
};

export default AdminUsersBalanceContainer;
