import React from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { UserLimits } from '~/components/Pages/Admin/UserLimits/UserLimits';
import { trpc } from '~/utils/trpc';
import { Button, Divider, Skeleton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { UserLimitsModal } from '~/components/Admin/UserLimitsModal/UserLimitsModal';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setLoading } from '~/state/ui';
import BackdropLoading from '~/components/BackdropLoading';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';

export default function UserLimitsPage() {
  const setUserLimits = trpc.admin.setUserLimits.useMutation();
  const removeUserLimits = trpc.admin.removeUserLimits.useMutation();
  const dispatch = useAppDispatch();
  const {
    data: userLimits,
    isLoading,
    refetch,
  } = trpc.appSettings.getUserLimits.useQuery();
  const [open, setOpen] = React.useState(false);
  const [currentValues, setCurrentValues] = React.useState<{
    username: string;
    min?: number | undefined;
    max?: number | undefined;
  }>();
  const loading = useAppSelector((state) => state.ui.loading);

  return (
    <AdminLayoutContainer>
      {isLoading || !userLimits ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <>
          <BackdropLoading open={loading} />
          <UserLimits
            onSubmit={(data) => {
              setUserLimits.mutate(data);
            }}
            defaultValues={userLimits.appSettings}
          />
          <Divider className="my-4" />
          <div style={{ height: 300 }}>
            <Typography className="my-4" variant="h5">
              User Limits
            </Typography>
            <DataGrid
              getRowId={(row) => row.userId}
              rows={userLimits.userAppSettings.map((userAppSettings) => ({
                ...userAppSettings,
              }))}
              columns={[
                { field: 'userId', flex: 1, headerName: 'userId' },
                { field: 'username', flex: 1, headerName: 'username' },
                { field: 'min', flex: 1, headerName: 'min' },
                { field: 'max', flex: 1, headerName: 'max' },
                {
                  flex: 1,
                  headerName: 'Actions',
                  field: 'setLimits',
                  renderCell(params) {
                    return (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            // open modal with current values
                            setOpen(true);
                            setCurrentValues({
                              username: params.row.username,
                              min: params.row.min,
                              max: params.row.max,
                            });
                          }}
                        >
                          Set Limits
                        </Button>
                        <Button
                          color="error"
                          onClick={async () => {
                            dispatch(setLoading(true));
                            try {
                              await removeUserLimits.mutateAsync({
                                userId: params.row.userId,
                              });
                              refetch();
                            } finally {
                              dispatch(setLoading(false));
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    );
                  },
                },
              ]}
            />
          </div>
          <UserLimitsModal
            onClose={() => {
              setOpen(false);
              setCurrentValues(undefined);
            }}
            isOpen={open}
            currentValues={{
              username: currentValues?.username || '',
              min: currentValues?.min,
              max: currentValues?.max,
            }}
            onSubmit={async (data) => {
              await setUserLimits.mutateAsync({
                ...data,
              });
              refetch();
              setOpen(false);
            }}
            isLoading={setUserLimits.isLoading}
          />
          <Button onClick={() => setOpen(true)}>Set New Limit</Button>
        </>
      )}
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
