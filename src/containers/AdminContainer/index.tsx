import React from 'react';
import { trpc } from '~/utils/trpc';
import BackdropLoading from '~/components/BackdropLoading';

const AdminContainer = (props: any) => {
  const { data, isLoading } = trpc.user.userDetails.useQuery();
  if (!isLoading && !data?.isAdmin)
    return (
      <p className="p-4">
        You don&lsquo;t have permission to access this page.
      </p>
    );

  return (
    <>
      <BackdropLoading open={isLoading} />
      {props.children}
    </>
  );
};

export default AdminContainer;
