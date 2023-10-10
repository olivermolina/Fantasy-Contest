import React, { useEffect } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Agent, User, UserStatus, UserType } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ManageUserRowModel } from './ManageUsers';
import { NEW_USER_ID } from '~/constants/NewUserId';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import FormControl from '@mui/material/FormControl';
import { UserFormValidationSchema } from '~/schemas/UserFormValidationSchema';
import { mapUserTypeLabel } from '~/utils/mapUserTypeLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { BlockedReasonCodesArray } from '~/lib/tsevo-gidx/ReasonCodes';
import ProfileTransactionHistoryContainer from '~/containers/ProfileTransactionHistoryContainer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-tab-${index}`,
    'aria-controls': `user-tabpanel-${index}`,
  };
}

/**
 * Defines the form fields for user form.
 */
export type UserFormInputs = z.infer<typeof UserFormValidationSchema>;

/**
 * Represents the properties of `UserForm` component.
 */
interface Props {
  user: ManageUserRowModel;
  onSubmit: (data: UserFormInputs) => void;
  closeForm: () => void;
  partners: (User & {
    UserAsAgents: Agent[];
  })[];
  userType?: UserType;
}

/**
 * Defines the `UserForm` component.
 */
export default function UserForm(props: Props) {
  const { user, closeForm, partners, userType } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<UserFormInputs>({
    resolver: zodResolver(UserFormValidationSchema),
  });

  const [tabValue, setTabValue] = React.useState(0);
  const [tsevoState, setTsevoState] = React.useState({
    'ID-UA18': true,
    'ID-EX': true,
    'ID-BLOCK': true,
    'ID-DECEASED': true,
    'ID-HR': true,
    'ID-HVEL-ACTV': true,
    'ID-AGE-UNKN': true,
    'ID-WL': true,
    'ID-ADDR-UPA': true,
    'DFP-VPRP': true,
    'DFP-HR-CONN': true,
    'LL-BLOCK': true,
  });

  const handleChangeTsevo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTsevoState = {
      ...tsevoState,
      [event.target.name]: event.target.checked,
    };
    setTsevoState(newTsevoState);
    setValue(
      'exemptedReasonCodes',
      Object.keys(newTsevoState).filter(
        (key) => !newTsevoState[key as keyof typeof newTsevoState],
      ),
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [DOBValue, setDOBValue] = React.useState<Dayjs | null>(
    dayjs(user?.DOB),
  );

  const handleChangeDOB = (newDOBValue: Dayjs | null) => {
    setDOBValue(newDOBValue);
    if (newDOBValue) {
      setValue('DOB', newDOBValue.toDate());
    }
  };

  /**
   * Resets the form fields when `user` prop changes.
   */
  useEffect(() => {
    reset({
      id: user.id,
      username: user.username || '',
      password: user.id === NEW_USER_ID ? '' : user.email || '',
      email: user.email,
      phone: user.phone?.toString(),
      status: user.status,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      address1: user.address1 || '',
      address2: user.address2 || '',
      city: user.city || '',
      state: user.state || '',
      postalCode: user.postalCode || '',
      DOB: user.DOB || dayjs().toDate(),
      type: user.type,
      agentId: user.agentId,
    });
    setTsevoState((prevState) => ({
      ...user.exemptedReasonCodes.reduce((acc, curr) => {
        acc[curr as keyof typeof tsevoState] = false;
        return acc;
      }, prevState),
    }));
  }, [user]);

  // Reset the tab value when there are errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // If there are errors in the first tab, set the tab value to 0
      if (errors.phone || errors.DOB) {
        setTabValue(0);
      } else {
        setTabValue(1);
      }
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div
        className={
          'flex justify-between bg-selected p-4 text-xl text-white items-center'
        }
      >
        <p className={'font-bold'}>
          {user.id === NEW_USER_ID ? 'Add ' : 'Edit '} User
        </p>
        <IconButton sx={{ color: 'inherit', mt: -1 }} onClick={closeForm}>
          <CloseIcon />
        </IconButton>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="User Tabs"
          variant="fullWidth"
        >
          <Tab label="Account" {...a11yProps(0)} />
          <Tab label="Address" {...a11yProps(1)} />
          <Tab label="TSEVO" {...a11yProps(2)} />
          <Tab label="Transactions" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className={'flex flex-col  divide-y divide-dashed justify-center'}>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Status</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <Controller
                name="status"
                control={control}
                defaultValue={user.status}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors?.status}
                    size={'small'}
                  >
                    <Select size={'small'} fullWidth {...field}>
                      <MenuItem key={'empty-status'} value={undefined}>
                        <span className={'italic text-gray-400'}>Status</span>
                      </MenuItem>
                      {[
                        UserStatus.ACTIVE,
                        UserStatus.INACTIVE,
                        UserStatus.SUSPENDED,
                      ].map((userStatus) => (
                        <MenuItem key={userStatus} value={userStatus}>
                          {userStatus}
                        </MenuItem>
                      ))}
                    </Select>

                    {errors?.status?.message ? (
                      <FormHelperText>{errors?.status?.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>ID</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('id')}
                disabled
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Email</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('email')}
                error={!!errors?.email}
                helperText={errors?.email?.message}
                disabled={user.id !== NEW_USER_ID}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Username</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('username')}
                error={!!errors?.username}
                helperText={errors?.username?.message}
                disabled={user.id !== NEW_USER_ID}
              />
            </div>
          </div>

          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Password</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                type="password"
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('password')}
                error={!!errors?.password}
                helperText={errors?.password?.message}
                disabled={user.id !== NEW_USER_ID}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Phone</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                type="number"
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('phone')}
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>DOB</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      error: !!errors?.DOB,
                      helperText: errors?.DOB?.message,
                    },
                  }}
                  value={DOBValue}
                  onChange={handleChangeDOB}
                />
              </LocalizationProvider>
            </div>
          </div>

          {userType !== UserType.AGENT && (
            <>
              <div
                className={
                  'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'
                }
              >
                <span className={'font-semibold'}>Type</span>
                <div className={'col-span-2 lg:col-span-5'}>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue={user.type}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors?.type}
                        size={'small'}
                      >
                        <Select size={'small'} fullWidth {...field}>
                          <MenuItem key={'empty-status'} value={undefined}>
                            <span className={'italic text-gray-400'}>
                              Select type
                            </span>
                          </MenuItem>
                          {[
                            UserType.PLAYER,
                            UserType.SUB_ADMIN,
                            UserType.AGENT,
                            UserType.ADMIN,
                          ].map((userType) => (
                            <MenuItem key={userType} value={userType}>
                              {mapUserTypeLabel(userType)}
                            </MenuItem>
                          ))}
                        </Select>

                        {errors?.type?.message ? (
                          <FormHelperText>
                            {errors?.type?.message}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div
                className={
                  'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'
                }
              >
                <span className={'font-semibold'}>Partner</span>
                <div className={'col-span-2 lg:col-span-5'}>
                  <Controller
                    name="agentId"
                    control={control}
                    defaultValue={''}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors?.type}
                        size={'small'}
                      >
                        <Select size={'small'} fullWidth {...field}>
                          <MenuItem key={'empty-status'} value={undefined}>
                            <span className={'italic text-gray-400'}>
                              Select type
                            </span>
                          </MenuItem>
                          {partners.map((partner) => (
                            <MenuItem
                              key={partner.UserAsAgents[0]!.id!}
                              value={partner.UserAsAgents[0]!.id!}
                            >
                              {partner.username}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div className={'flex flex-col  divide-y divide-dashed justify-center'}>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>First Name</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('firstname')}
                error={!!errors?.firstname}
                helperText={errors?.firstname?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Last Name</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('lastname')}
                error={!!errors?.lastname}
                helperText={errors?.lastname?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Address 1</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('address1')}
                error={!!errors?.address1}
                helperText={errors?.address1?.message}
              />
            </div>
          </div>

          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Address 2</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('address2')}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>City</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('city')}
                error={!!errors?.city}
                helperText={errors?.city?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>State</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('state')}
                error={!!errors?.state}
                helperText={errors?.state?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Postal/Zip</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('postalCode')}
                error={!!errors?.postalCode}
                helperText={errors?.postalCode?.message}
              />
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel index={tabValue} value={2}>
        <div className={'flex'}>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
              Manage Blocked Reason Codes from TSEVO
            </FormLabel>
            <FormGroup>
              <div
                className={
                  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-4 mt-4'
                }
              >
                {BlockedReasonCodesArray.map((reasonCode) => (
                  <FormControlLabel
                    key={reasonCode}
                    control={
                      <Checkbox
                        checked={
                          tsevoState[reasonCode as keyof typeof tsevoState]
                        }
                        onChange={handleChangeTsevo}
                        name={reasonCode}
                      />
                    }
                    label={reasonCode}
                  />
                ))}
              </div>
            </FormGroup>
          </FormControl>
        </div>
      </TabPanel>
      <TabPanel index={tabValue} value={3}>
        <div className={'p-2 h-full w-full'}>
          <ProfileTransactionHistoryContainer userId={user.id} />
        </div>
      </TabPanel>
      <div className={'flex flex-row justify-between p-4'}>
        <Button variant={'outlined'} onClick={closeForm}>
          Cancel
        </Button>
        <Button variant={'contained'} type={'submit'}>
          Save
        </Button>
      </div>
    </form>
  );
}
