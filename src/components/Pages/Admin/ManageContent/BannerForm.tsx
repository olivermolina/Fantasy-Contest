import React, { useEffect } from 'react';
import {
  Box,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ManageBannerRowModel } from './ManageBanners';
import { NEW_USER_ID } from '~/constants/NewUserId';
import CloseIcon from '@mui/icons-material/Close';
import { BannerFormValidationSchema } from '~/schemas/BannerFormValidationSchema';
import FormControl from '@mui/material/FormControl';
import { AppSettings } from '@prisma/client';

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
    id: `banner-tab-${index}`,
    'aria-controls': `banner-tabpanel-${index}`,
  };
}

/**
 * Defines the form fields for user form.
 */
export type BannerFormInputs = z.infer<typeof BannerFormValidationSchema>;

/**
 * Represents the properties of `UserForm` component.
 */
interface Props {
  banner: ManageBannerRowModel;
  onSubmit: (data: BannerFormInputs) => void;
  closeForm: () => void;
  appSettings: AppSettings[];
}

/**
 * Defines the `UserForm` component.
 */
export default function BannerForm(props: Props) {
  const { banner, closeForm } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<BannerFormInputs>({
    resolver: zodResolver(BannerFormValidationSchema),
  });

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  /**
   * Resets the form fields when `banner` prop changes.
   */
  useEffect(() => {
    reset({
      id: banner.id,
      text: banner.text,
      priority: banner.priority,
      appSettingId: banner.appSettingId,
    });
  }, [banner]);

  // Reset the tab value when there are errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // If there are errors in the first tab, set the tab value to 0
      if (errors.text || errors.priority) {
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
          {banner.id === NEW_USER_ID ? 'Add ' : 'Edit '} User
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
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className={'flex flex-col  divide-y divide-dashed justify-center'}>
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
            <span className={'font-semibold'}>Text</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('text')}
                error={!!errors?.text}
                helperText={errors?.text?.message}
              />
            </div>
          </div>
          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>Priority</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <TextField
                type="number"
                variant={'outlined'}
                size={'small'}
                fullWidth
                {...register('priority')}
                error={!!errors?.priority}
                helperText={errors?.priority?.message}
              />
            </div>
          </div>

          <div
            className={'grid grid-cols-3 items-center lg:grid-cols-6 p-4 gap-2'}
          >
            <span className={'font-semibold'}>AppSetting</span>
            <div className={'col-span-2 lg:col-span-5'}>
              <Controller
                name="appSettingId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors?.appSettingId}
                    size={'small'}
                  >
                    <Select size={'small'} fullWidth {...field}>
                      {props.appSettings.map((appSetting) => (
                        <MenuItem key={appSetting.id} value={appSetting.id}>
                          {appSetting.name} &mdash;
                          <span className={'italic text-gray-500 pl-1'}>
                            ${appSetting.value}
                          </span>
                        </MenuItem>
                      ))}
                    </Select>

                    {errors?.appSettingId?.message ? (
                      <FormHelperText>
                        {errors?.appSettingId?.message}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>
      </TabPanel>

      <div className={'flex flex-row justify-between p-4'}>
        <Button variant={'outlined'} onClick={closeForm}>
          Cancel
        </Button>
        <Button variant={'outlined'} type={'submit'}>
          Save
        </Button>
      </div>
    </form>
  );
}
