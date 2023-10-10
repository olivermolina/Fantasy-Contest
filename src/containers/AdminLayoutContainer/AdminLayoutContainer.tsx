import React, { useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import AdminLayout from '~/components/Admin/AdminLayout';
import { useAppDispatch } from '~/state/hooks';
import { setUserDetails } from '~/state/profile';

const AdminLayoutContainer = (props: React.PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const logoutMutation = trpc.user.logout.useMutation();
  const { data } = trpc.user.userDetails.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      dispatch(
        setUserDetails({
          id: data?.id || '',
          username: data?.username || '',
          email: data?.email || '',
          image: `https://eu.ui-avatars.com/api/?name=${data?.username}&size=250&color=fff&background=1A487F`,
          followers: 502,
          following: 300,
          showFollowers: false,
          isFirstDeposit: data?.isFirstDeposit,
          isAdmin: data?.isAdmin,
          firstname: data?.firstname || '',
          lastname: data?.lastname || '',
          address1: data?.address1 || '',
          address2: data?.address2 || '',
          city: data?.city || '',
          state: data?.state || '',
          postalCode: data?.postalCode || '',
          dob: data?.DOB?.toString() || '',
          type: data.type,
        }),
      );
    }
  }, [data]);

  const onMenuItemClick = async (path: string) => {
    if (path === UrlPaths.Logout) {
      await logoutMutation.mutateAsync();
      await router.push('/');
    } else {
      await router.push(
        {
          pathname: path,
        },
        undefined,
        { scroll: true },
      );
    }
  };

  return (
    <>
      <AdminLayout
        router={router}
        onMenuItemClick={onMenuItemClick}
        user={data}
      >
        {props.children}
      </AdminLayout>
    </>
  );
};

export default AdminLayoutContainer;
