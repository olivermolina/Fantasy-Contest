import React from 'react';
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
import { User } from '@prisma/client';
import { IconButton } from '@mui/material';
import { mapUserTypeLabel } from '~/utils/mapUserTypeLabel';

export type ManagePartnersPamsRowModel = Pick<
  User,
  'id' | 'username' | 'email' | 'status' | 'type' | 'timezone'
> & {
  subAdminIds: string[];
  phone: string;
  password?: string;
};

interface Props {
  users: ManagePartnersPamsRowModel[];
  openUserForm: (user: ManagePartnersPamsRowModel) => void;
  addUser: () => void;
  subAdminUsers: User[] | [];
}

export default function ManagePartnersPams(props: Props) {
  const rows: GridRowsProp<ManagePartnersPamsRowModel> = props.users;

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
      field: 'type',
      headerName: 'Type',

      renderCell: (params) => {
        const user = params.row as (typeof rows)[0];
        return mapUserTypeLabel(user.type);
      },
    },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
    },

    {
      flex: 1,
      field: 'pams',
      headerName: 'Assigned PAMs',
      renderCell: (params) => {
        const user = params.row as (typeof rows)[0];
        const assignedPams = user.subAdminIds?.map(
          (id) => props.subAdminUsers.find((pam) => pam.id === id)?.username,
        );

        return assignedPams?.join(', ');
      },
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
  ];

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
