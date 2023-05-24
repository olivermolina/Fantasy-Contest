import React from 'react';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '@prisma/client';
import { IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { convertUserAddressToString } from '~/utils/convertUserAddressToString';

export type ManageUserRowModel = Omit<
  User,
  'isAdmin' | 'identityStatus' | 'reasonCodes' | 'type' | 'agentId' | 'phone'
> & { phone: string; password?: string };

interface Props {
  users: ManageUserRowModel[];
  openUserForm: (user: ManageUserRowModel) => void;
  addUser: () => void;
}

export default function ManageUsers(props: Props) {
  const rows: GridRowsProp<ManageUserRowModel> = props.users;

  const columns: GridColDef[] = [
    { flex: 1, field: 'id', headerName: 'ID' },
    {
      flex: 1,
      field: 'username',
      headerName: 'Username',
    },
    {
      flex: 1,
      field: 'email',
      headerName: 'Email',
    },
    {
      flex: 1,
      field: 'name',
      headerName: 'Name',
      renderCell: (params) => {
        const user = params.row as typeof rows[0];
        return `${user.firstname || ''} ${user.lastname || ''}`;
      },
    },
    {
      flex: 1,
      field: 'phone',
      headerName: 'Phone',
    },
    {
      flex: 1,
      field: 'DOB',
      headerName: 'DOB',
      renderCell: (params) => {
        const user = params.row as typeof rows[0];
        return dayjs(user.DOB).format('YYYY-MM-DD');
      },
    },
    {
      flex: 1,
      field: 'address',
      headerName: 'Address',
      renderCell: (params) => {
        const { address1, address2, city, state, postalCode } =
          params.row as typeof rows[0];
        return convertUserAddressToString({
          address1,
          address2,
          city,
          state,
          postalCode,
        });
      },
    },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
    },
    {
      flex: 1,
      field: 'referral',
      headerName: 'Referral Code',
    },
    {
      flex: 1,
      field: 'deposited',
      headerName: 'Deposited',
      renderCell: (params) => {
        const user = params.row as typeof rows[0];
        return user.isFirstDeposit ? 'No' : 'Yes';
      },
    },
    {
      flex: 2,
      field: 'created_at',
      headerName: 'Sign-up Date',
      renderCell: (params) => {
        const user = params.row as typeof rows[0];
        return dayjs(user.created_at).format('YYYY-MM-DD HH:mm A');
      },
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => {
        const user = params.row as typeof rows[0];
        const onClick = () => {
          props.openUserForm(user);
        };

        return (
          <IconButton onClick={onClick}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <div className={'flex flex-col gap-4 h-screen w-full pb-6'}>
      <div className={'flex flex-row-reverse gap-2'}>
        <Button variant={'contained'} onClick={props.addUser}>
          Add User
        </Button>
      </div>
      <DataGrid
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
    </div>
  );
}
