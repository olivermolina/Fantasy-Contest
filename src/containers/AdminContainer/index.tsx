import React from 'react';
import { trpc } from '~/utils/trpc';
import BackdropLoading from '~/components/BackdropLoading';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';
import AdminHome from '~/components/Pages/Admin/AdminHome/AdminHome';
import { useRouter } from 'next/router';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

const AdminContainer = () => {
  const { data, isLoading } = trpc.admin.getMenus.useQuery();
  const router = useRouter();

  return (
    <>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={isLoading} />
      <AdminLayoutContainer>
        <AdminHome router={router} menus={data || []} />
      </AdminLayoutContainer>
    </>
  );
};

export default AdminContainer;
