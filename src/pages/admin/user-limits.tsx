import React, { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { GlobalLimits } from '~/components/Pages/Admin/UserLimits/GlobalLimits';
import { trpc } from '~/utils/trpc';
import { Button, Skeleton } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { UserLimitsModal } from '~/components/Admin/UserLimitsModal/UserLimitsModal';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setLoading } from '~/state/ui';
import BackdropLoading from '~/components/BackdropLoading';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  PicksCategoryLimits,
  PicksCategoryLimitType,
} from '~/components/Pages/Admin/UserLimits/PicksCategoryLimits';
import { toast } from 'react-toastify';
import { LeagueLimitType } from '~/schemas/LeagueLimitFormValidationSchema';
import LeagueLimits from '~/components/Pages/Admin/UserLimits/LeagueLimits';
import { UserLimitInputs } from '~/schemas/UserLimitValidationSchema';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3, px: 1 }}>{children}</Box>}
    </div>
  );
}

export default function UserLimitsPage() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { data, refetch: usersRefetch } = trpc.user.users.useQuery();
  const { data: contestCategories, refetch: contestCategoriesRefetch } =
    trpc.contest.contestCategoryList.useQuery();
  const setUserLimits = trpc.admin.setUserLimits.useMutation();
  const removeUserLimits = trpc.admin.removeUserLimits.useMutation();
  const setContestCategoryLimits =
    trpc.admin.setContestCategoryLimits.useMutation();
  const setLeagueLimits = trpc.admin.setLeagueLimits.useMutation();
  const dispatch = useAppDispatch();
  const {
    data: userLimits,
    isLoading,
    refetch,
  } = trpc.appSettings.getUserLimits.useQuery();
  const [open, setOpen] = React.useState(false);
  const [currentValues, setCurrentValues] = React.useState<
    UserLimitInputs | undefined
  >(undefined);
  const loading = useAppSelector((state) => state.ui.loading);

  const userRows: GridRowsProp<UserLimitInputs> = useMemo(() => {
    return (
      userLimits?.userAppSettings.map((userAppSettings) => ({
        ...userAppSettings,
        notes:
          data?.find((user) => user.id === userAppSettings.userId)?.notes || '',
        bonusCreditLimits: userAppSettings.bonusCreditLimits.map((limit) => ({
          ...limit,
          bonusCreditFreeEntryEquivalent: limit.bonusCreditFreeEntryEquivalent,
        })),
      })) || []
    );
  }, [userLimits]);

  const userOptions = useMemo(() => {
    if (!data) return [];

    if (currentValues?.userId) {
      return data;
    }

    return data?.filter(
      (user) => !userRows?.map((user) => user.userId)?.includes(user.id),
    );
  }, [data, currentValues]);

  const picksCategoryLimits = useMemo(() => {
    if (!contestCategories) return { picksCategoryLimits: [] };

    return {
      picksCategoryLimits: contestCategories?.map(
        (contestCategory) =>
          ({
            ...contestCategory,
            minStakeAmount: Number(
              contestCategory.minStakeAmount || userLimits?.appSettings.min,
            ),
            maxStakeAmount: Number(
              contestCategory.maxStakeAmount || userLimits?.appSettings.max,
            ),
          } as PicksCategoryLimitType['picksCategoryLimits'][0]),
      ),
    };
  }, [contestCategories, userLimits]);

  return (
    <AdminLayoutContainer>
      {isLoading || !userLimits ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <div className={'flex flex-col gap-2'}>
          <BackdropLoading
            open={
              loading ||
              setUserLimits.isLoading ||
              removeUserLimits.isLoading ||
              setContestCategoryLimits.isLoading ||
              setLeagueLimits.isLoading
            }
          />
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="Entry Limits"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Global Limits" {...a11yProps(0)} />
                <Tab label="User Limits" {...a11yProps(1)} />
                <Tab
                  label="Number of Picks Category Limits"
                  {...a11yProps(2)}
                />
                <Tab label="League/Sport Limits" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <GlobalLimits
                onSubmit={(data) => {
                  setUserLimits.mutate(data);
                  toast.success('Global limits updated successfully');
                }}
                defaultValues={userLimits.appSettings}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div className={'flex flex-col gap-2 justify-start'}>
                <div style={{ height: 300, width: '100%' }}>
                  <DataGrid
                    hideFooterSelectedRowCount
                    getRowId={(row) => row.userId!}
                    rows={userRows}
                    columns={[
                      { field: 'userId', flex: 1, headerName: 'userId' },
                      { field: 'username', flex: 1, headerName: 'username' },
                      { field: 'min', flex: 1, headerName: 'min' },
                      { field: 'max', flex: 1, headerName: 'max' },
                      {
                        field: 'maxDailyTotalBetAmount',
                        flex: 1,
                        headerName: 'Max Daily Total Bet',
                      },
                      {
                        field: 'repeatEntries',
                        flex: 1,
                        headerName: 'Repeat Entries',
                      },
                      {
                        field: 'notes',
                        flex: 1,
                        headerName: 'Notes',
                      },
                      {
                        flex: 1,
                        minWidth: 150,
                        headerName: 'Actions',
                        field: 'setLimits',
                        renderCell(params) {
                          return (
                            <div className="flex flex-col lg:flex-row">
                              <Button
                                size={'small'}
                                onClick={() => {
                                  // open modal with current values
                                  setOpen(true);
                                  setCurrentValues(params.row);
                                }}
                              >
                                Set Limits
                              </Button>
                              <Button
                                size={'small'}
                                color="error"
                                onClick={async () => {
                                  dispatch(setLoading(true));
                                  try {
                                    await removeUserLimits.mutateAsync({
                                      userId: params.row.userId!,
                                    });
                                    refetch();

                                    toast.success(
                                      'successfully remove user limits.',
                                    );
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
                    initialState={{
                      columns: {
                        columnVisibilityModel: {
                          // Hide columns status and traderName, the other columns will remain visible
                          maxDailyTotalBetAmount: false,
                          repeatEntries: false,
                        },
                      },
                    }}
                  />
                </div>

                <Button
                  onClick={() => {
                    setCurrentValues({
                      userId: '',
                      username: '',
                      min: userLimits.appSettings.min,
                      max: userLimits.appSettings.max,
                      maxDailyTotalBetAmount:
                        userLimits.appSettings.maxDailyTotalBetAmount,
                      repeatEntries: userLimits.appSettings.repeatEntries,
                      bonusCreditLimits:
                        userLimits.appSettings.bonusCreditLimits.map(
                          (limit) => ({
                            ...limit,
                            bonusCreditFreeEntryEquivalent: Number(
                              limit.bonusCreditFreeEntryEquivalent,
                            ),
                          }),
                        ),
                      notes: '',
                    });
                    setOpen(true);
                  }}
                  sx={{ width: 150 }}
                  variant={'contained'}
                >
                  Set New Limit
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <PicksCategoryLimits
                onSubmit={async (data) => {
                  await setContestCategoryLimits.mutate(data);
                  await contestCategoriesRefetch();

                  toast.success(
                    'Number of picks category limits updated successfully',
                  );
                }}
                defaultValues={picksCategoryLimits}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <LeagueLimits
                onSubmit={async (data) => {
                  await setLeagueLimits.mutate(data);
                  toast.success('League limits updated successfully');
                }}
                leagueLimits={
                  userLimits?.leagueLimits || ([] as LeagueLimitType[])
                }
              />
            </TabPanel>
          </Box>
          <UserLimitsModal
            users={userOptions}
            onClose={() => {
              setOpen(false);
              setCurrentValues(undefined);
            }}
            isOpen={open}
            currentValues={currentValues}
            onSubmit={async (inputs) => {
              await setUserLimits.mutateAsync(inputs);
              refetch();
              usersRefetch();
              setOpen(false);
              setCurrentValues(undefined);
            }}
            isLoading={setUserLimits.isLoading}
          />
        </div>
      )}
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
