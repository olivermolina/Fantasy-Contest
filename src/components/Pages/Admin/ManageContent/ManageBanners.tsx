import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { ContentSettingsState } from '~/state/manageContent';
import { AppSettings } from '@prisma/client';

export type ManageBanner = {
  id: string;
  text: string;
  priority: number;
  appSettingId: string | null;
  appSetting: AppSettings | null;
};

const formSchema = z.object({
  challengePromoMessage: z.string().min(1, 'Promo message is required'),
  referralCustomText: z.coerce
    .string()
    .min(1, 'Referral custom text is required'),
  homePageHeading1: z.string().min(1, 'Home page heading 1 is required'),
  homePageHeading2: z.string().min(1, 'Home page heading 2 is required'),
});

export type ContentSettingFormSchemaType = z.infer<typeof formSchema>;

export type ManageBannerRowModel = Omit<
  ManageBanner,
  'created_at' | 'updated_at'
>;

interface Props {
  onSubmit: (data: ContentSettingFormSchemaType) => void;
  banners: ManageBannerRowModel[];
  openBannersForm: (banners: ManageBannerRowModel) => void;
  contentSettings: ContentSettingsState;
}

export default function ManageBanners(props: Props) {
  const { contentSettings } = props;

  const rows: GridRowsProp<ManageBannerRowModel> = props.banners;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<ContentSettingFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const columns: GridColDef[] = [
    { flex: 1, field: 'id', headerName: 'ID' },
    {
      flex: 1,
      field: 'text',
      headerName: 'Text',
    },
    {
      flex: 1,
      field: 'priority',
      headerName: 'Priority',
    },
    {
      flex: 1,
      field: 'appSettingName',
      headerName: 'AppSetting Name',
      renderCell: (params) => {
        const row = params.row as (typeof rows)[0];
        return row.appSetting?.name;
      },
    },
    {
      flex: 1,
      field: 'appSettingValue',
      headerName: 'AppSetting Value',
      renderCell: (params) => {
        const row = params.row as (typeof rows)[0];
        return row.appSetting?.value;
      },
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => {
        const user = params.row as (typeof rows)[0];
        const onClick = () => {
          props.openBannersForm(user);
        };

        return (
          <IconButton onClick={onClick}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (contentSettings) {
      reset({
        challengePromoMessage: contentSettings.CHALLENGE_PROMO_MESSAGE,
        referralCustomText: contentSettings.REFERRAL_CUSTOM_TEXT,
        homePageHeading1: contentSettings.HOMEPAGE_HEADING_1,
        homePageHeading2: contentSettings.HOMEPAGE_HEADING_2,
      });
    }
  }, [contentSettings]);

  return (
    <div className={'flex flex-col gap-4 w-full pb-6'}>
      <p className={'font-semibold text-md'}>Banners</p>
      <DataGrid
        autoHeight
        disableColumnSelector
        disableDensitySelector
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [],
            },
          },
        }}
        getRowId={(row) => row.id}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
      <div>
        <form onSubmit={handleSubmit(props.onSubmit)} className={'space-y-4'}>
          <div className={'flex flex-col gap-4'}>
            <p className={'font-semibold text-md'}>Home Page</p>
            <TextField
              label="Heading 1"
              variant="outlined"
              fullWidth
              {...register('homePageHeading1')}
              error={!!errors?.homePageHeading1}
              helperText={errors?.homePageHeading1?.message}
              size={'small'}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Heading 2"
              variant="outlined"
              fullWidth
              {...register('homePageHeading2')}
              error={!!errors?.homePageHeading2}
              helperText={errors?.homePageHeading2?.message}
              size={'small'}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className={'flex flex-col gap-4'}>
            <p className={'font-semibold text-md'}>Challenge Page</p>
            <TextField
              label="Promo Message"
              placeholder={'-150'}
              variant="outlined"
              fullWidth
              {...register('challengePromoMessage')}
              error={!!errors?.challengePromoMessage}
              helperText={errors?.challengePromoMessage?.message}
              size={'small'}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          {/*Referrals*/}
          <div className={'flex flex-col gap-4'}>
            <p className={'font-semibold text-md'}>Referrals</p>
            <TextField
              type={'text'}
              label="Referral Custom text"
              variant="outlined"
              fullWidth
              {...register('referralCustomText')}
              error={!!errors?.referralCustomText}
              helperText={errors?.referralCustomText?.message}
              size={'small'}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className={'flex flex-row items-center justify-center gap-4'}>
            <Button
              variant={'outlined'}
              fullWidth
              onClick={() => reset()}
              disabled={!isDirty}
            >
              Cancel
            </Button>
            <Button
              variant={'outlined'}
              fullWidth
              type={'submit'}
              disabled={!isDirty && !isValid}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
