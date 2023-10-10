import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import { trpc } from '~/utils/trpc';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbar,
  MuiEvent,
} from '@mui/x-data-grid';
import AdminLayoutContainer from '~/containers/AdminLayoutContainer/AdminLayoutContainer';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import { Button, LinearProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import { randomId } from '@mui/x-data-grid-generator';
import { League } from '@prisma/client';

export default function MarketCategoryPage() {
  const { data, isLoading } = trpc.admin.marketCategories.useQuery();
  const mutate = trpc.admin.saveMarketCategory.useMutation();

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const [rows, setRows] = React.useState<GridRowsProp>(data ?? []);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const saveMarketCategory = async (row: GridRowModel) => {
    try {
      await mutate.mutateAsync({
        id: row.id,
        category: row.category,
        order: row.order,
        league: row.league,
      });
      toast.success('Market Category saved successfully!');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong. Please try again later.`,
      );
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    saveMarketCategory(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleNew = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, category: '', league: '', isNew: true, order: null },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'league' },
    }));
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'ID',

      renderCell: (params) => {
        const currentRow = params.row;
        return <TruncateCellContent value={currentRow.id} />;
      },
    },
    {
      field: 'league',
      flex: 1,
      headerName: 'League',
      editable: true,
      type: 'singleSelect',
      valueOptions: Object.keys(League),
    },
    {
      field: 'category',
      flex: 1,
      headerName: 'Category',
      editable: true,
    },
    {
      field: 'order',
      flex: 1,
      headerName: 'Order',
      editable: true,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  return (
    <AdminLayoutContainer>
      <div className={'h-[75vh] lg:h-[80vh] w-full'}>
        <Button variant={'contained'} sx={{ my: 2 }} onClick={handleNew}>
          Add New Category
        </Button>
        <DataGrid
          rows={rows}
          loading={isLoading}
          slots={{
            toolbar: GridToolbar,
            loadingOverlay: LinearProgress,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: [],
              },
            },
            sorting: {
              sortModel: [{ field: 'order', sort: 'desc' }],
            },
          }}
          getRowId={(row) => row.id}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </AdminLayoutContainer>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
}, 'ADMIN');
