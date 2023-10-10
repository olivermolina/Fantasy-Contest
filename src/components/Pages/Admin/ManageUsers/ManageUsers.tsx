import React, { useMemo } from 'react';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Agent, User } from '@prisma/client';
import { IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { convertUserAddressToString } from '~/utils/convertUserAddressToString';
import Link from 'next/link';

export type ManageUserRowModel = Omit<
  User,
  'isAdmin' | 'identityStatus' | 'reasonCodes' | 'phone' | 'notes'
> & { phone: string; password?: string };

interface Props {
  users: ManageUserRowModel[];
  openUserForm: (user: ManageUserRowModel) => void;
  addUser: () => void;
  partners: (User & {
    UserAsAgents: Agent[];
  })[];
}

export default function ManageUsers(props: Props) {
  const rows: GridRowsProp<ManageUserRowModel> = props.users;

  const columns: GridColDef[] = useMemo(
    () => [
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
          const user = params.row as (typeof rows)[0];
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
          const user = params.row as (typeof rows)[0];
          return dayjs(user.DOB).format('YYYY-MM-DD');
        },
      },
      {
        flex: 1,
        field: 'address',
        headerName: 'Address',
        renderCell: (params) => {
          const { address1, address2, city, state, postalCode } =
            params.row as (typeof rows)[0];
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
        field: 'assignedPartner',
        headerName: 'Assigned Partner',
        renderCell: (params) => {
          const user = params.row as (typeof rows)[0];
          const assignedPartner = props.partners.find(
            (partner) => partner.UserAsAgents?.[0]?.id === user.agentId,
          );
          return assignedPartner?.username ?? '';
        },
      },
      {
        flex: 1,
        field: 'deposited',
        headerName: 'Deposited',
        renderCell: (params) => {
          const user = params.row as (typeof rows)[0];
          return user.isFirstDeposit ? 'No' : 'Yes';
        },
      },
      {
        flex: 1.5,
        field: 'created_at',
        headerName: 'Sign-up Date',
        renderCell: (params) => {
          const user = params.row as (typeof rows)[0];
          return dayjs(user.created_at).format('YYYY-MM-DD HH:mm A');
        },
      },
      {
        field: 'transactions',
        headerName: 'Transactions',
        width: 150,
        renderCell: (params) => (
          <Link href={`/transactions?userId=${params.id}`} legacyBehavior>
            <a
              className={'underline text-blue-500'}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </Link>
        ),
      },
      {
        flex: 1,
        field: 'action',
        headerName: 'Action',
        renderCell: (params) => {
          const user = params.row as (typeof rows)[0];
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
    ],
    [props.partners],
  );

  return (
    <div className={'w-full h-[75vh]'}>
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
        slots={{
          toolbar: () => {
            return (
              <>
                <div className={'flex flex-row-reverse gap-2 m-2'}>
                  <Button variant={'contained'} onClick={props.addUser}>
                    Add User
                  </Button>
                </div>
                <GridToolbarContainer>
                  <GridToolbarExport />
                  <span className={'grow'} />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              </>
            );
          },
        }}
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
