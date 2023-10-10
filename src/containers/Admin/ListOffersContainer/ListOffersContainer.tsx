import React, { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';
import { ContestType, League } from '@prisma/client';
import { Button, MenuItem, TextField } from '@mui/material';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import { TruncateCellContent } from '~/components/Pages/Admin/LineExposure/LineExposure';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEditInputCell,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel,
  MuiEvent,
  useGridApiContext,
} from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';
import { darken, lighten, styled } from '@mui/material/styles';
import { MARKET_STATUS_ENUM } from '~/components/Admin/Market/MarketForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Override': {
    backgroundColor: getBackgroundColor(
      theme.palette.info.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));

function EditInputCell(props: GridRenderEditCellParams) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function StatusEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === MARKET_STATUS_ENUM.ACTIVE;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <TextField
      id="status"
      select
      fullWidth
      size={'small'}
      value={value ? MARKET_STATUS_ENUM.ACTIVE : MARKET_STATUS_ENUM.SUSPENDED}
      onChange={handleChange}
    >
      <MenuItem key={'empty-status'} value={undefined} disabled>
        <em>Select status</em>
      </MenuItem>
      {Object.keys(MARKET_STATUS_ENUM).map((value) => (
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  );
}

const renderStatusEditInputCell: GridColDef['renderCell'] = (params) => {
  return <StatusEditInputCell {...params} />;
};

export interface ListOfferRowModel extends GridValidRowModel {
  id: string;
  selId: number;
  league: string;
  playerName: string;
  statName: string;
  total: number;
  underOdds: number;
  overOdds: number;
  originalTotal: number;
  originalUnderOdds: number;
  originalOverOdds: number;
  adjustedTotal?: number;
  adjustedUnderOdds?: number;
  adjustedOverOdds?: number;
  matchName: string;
  matchTime: string;
  active: boolean;
}

export const ListOfferFilterSchema = z.object({
  league: z.nativeEnum(League),
  min: z.coerce.number().min(-1000),
  max: z.coerce.number().min(1),
});

type ListOfferFilterType = z.infer<typeof ListOfferFilterSchema>;

export default function ListOffersContainer() {
  const [defaultFilterValues, setDefaultFilterValues] =
    useState<ListOfferFilterType>({
      league: League.NBA,
      min: -200,
      max: 200,
    });

  const { register, handleSubmit, watch } = useForm<ListOfferFilterType>({
    resolver: zodResolver(ListOfferFilterSchema),
    defaultValues: defaultFilterValues,
  });

  const onSubmit = (inputs: ListOfferFilterType) => {
    setDefaultFilterValues(inputs);
  };

  const [rows, setRows] = React.useState<GridRowsProp<ListOfferRowModel>>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const { isLoading, data } = trpc.contest.listOffers.useQuery(
    {
      contestId: MORE_OR_LESS_CONTEST_ID,
      includeInActive: true,
      league: defaultFilterValues.league,
      oddsRange: {
        min: defaultFilterValues.min,
        max: defaultFilterValues.max,
      },
    },
    {
      retry: false,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const mutation = trpc.admin.overrideOffer.useMutation();

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
    event.defaultMuiPrevented = true;
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
  };

  const processRowUpdate = async (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel,
  ) => {
    const listOfferRow = newRow as ListOfferRowModel;

    setRows(
      rows.map((row) => (row.id === listOfferRow.id ? listOfferRow : row)),
    );

    if (
      listOfferRow.adjustedTotal ||
      listOfferRow.adjustedOverOdds ||
      listOfferRow.adjustedUnderOdds ||
      listOfferRow.active !== oldRow.active
    ) {
      try {
        await mutation.mutateAsync({
          id: listOfferRow.id,
          selId: Number(listOfferRow.selId),
          total: Number(listOfferRow.originalTotal),
          over: Number(listOfferRow.originalOverOdds),
          under: Number(listOfferRow.originalUnderOdds),
          adjustedTotal: listOfferRow.adjustedTotal
            ? Number(listOfferRow.adjustedTotal)
            : undefined,
          adjustedOver: listOfferRow.adjustedOverOdds
            ? Number(listOfferRow.adjustedOverOdds)
            : undefined,
          adjustedUnder: listOfferRow.adjustedUnderOdds
            ? Number(listOfferRow.adjustedUnderOdds)
            : undefined,
          active: listOfferRow.active,
        });
        toast.success(
          `${listOfferRow.playerName} | ${listOfferRow.statName} successfully updated!`,
        );
      } catch (error) {
        const e = error as TRPCClientError<any>;
        toast.error(
          e?.message || `Oops! Something went wrong! Please try again later.`,
        );
      }
    }

    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const watchLeague = watch('league');

  useEffect(() => {
    setDefaultFilterValues((prevState) => ({
      ...prevState,
      league: watchLeague,
    }));
  }, [watchLeague]);

  useEffect(() => {
    if (data?.type === ContestType.FANTASY) {
      const rows = data?.offers.filter(
        (offer) => offer.type === 'PP',
      ) as ListOfferRowModel[];
      setRows(
        rows.map((row) => ({
          ...row,
          id: row.freeSquare ? `${row.id}-free-square` : row.id,
        })),
      );
    }
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      flex: 1,
      headerName: 'ID',
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return <TruncateCellContent value={currentRow?.id as string} />;
      },
    },
    {
      field: 'league',
      flex: 1,
      headerName: 'League',
    },
    {
      field: 'playerName',
      flex: 1,
      headerName: 'Player',
    },
    {
      flex: 1,
      field: 'statName',
      headerName: 'Stat',
    },
    {
      flex: 1,
      field: 'originalTotal',
      headerName: 'Total',
    },
    {
      flex: 1,
      field: 'adjustedTotal',
      headerName: 'Adj Total',
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        if (!params.props.value) return params.props;

        const value = Number(params.props.value);
        return {
          ...params.props,
          error: _.isNaN(value) ? 'Please enter a valid projected stat' : null,
        };
      },
      renderEditCell: EditInputCell,
    },
    {
      field: 'originalUnderOdds',
      flex: 1,
      headerName: 'Under Odds',
    },
    {
      field: 'adjustedUnderOdds',
      flex: 1,
      headerName: 'Adj Under Odds',
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        if (!params.props.value) return params.props;

        const value = Number(params.props.value);
        return {
          ...params.props,
          error: _.isNaN(value) ? 'Please enter a valid odds' : null,
        };
      },
      renderEditCell: EditInputCell,
    },
    {
      field: 'originalOverOdds',
      flex: 1,
      headerName: 'Over Odds',
    },
    {
      field: 'adjustedOverOdds',
      flex: 1,
      headerName: 'Adj Over Odds',
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        if (!params.props.value) return params.props;

        const value = Number(params.props.value);
        return {
          ...params.props,
          error: _.isNaN(value) ? 'Please enter a valid odds' : null,
        };
      },
      renderEditCell: EditInputCell,
    },
    {
      field: 'active',
      flex: 1,
      headerName: 'Status',
      editable: true,
      renderEditCell: renderStatusEditInputCell,
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        return currentRow?.active ? 'ACTIVE' : 'SUSPENDED';
      },
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        return params.props;
      },
    },
    {
      field: 'matchName',
      flex: 1,
      headerName: 'Match Up',
    },
    {
      field: 'matchTime',
      flex: 1,
      headerName: 'Match DateTime',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'saveButton'}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancelButton'}
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
            key={'editButton'}
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

  return (
    <div className={'h-[75vh] lg:h-[80vh] w-full'}>
      <StyledDataGrid
        loading={isLoading}
        slots={{
          toolbar: () => {
            return (
              <div
                className={
                  'flex flex-row justify-between items-center border-b p-2'
                }
              >
                <form onSubmit={handleSubmit(onSubmit)} id={'listOfferForm'}>
                  <div
                    className={'flex flex-row items-center justify-start gap-2'}
                  >
                    <TextField
                      id="league"
                      select
                      label="Select league"
                      size={'small'}
                      sx={{ width: 200 }}
                      defaultValue={defaultFilterValues.league}
                      {...register('league')}
                    >
                      <MenuItem key={'empty-league'} value={undefined}>
                        <span className={'italic text-gray-400'}>
                          Select league
                        </span>
                      </MenuItem>
                      {Object.values(League).map((value: League) => (
                        <MenuItem key={value} value={value}>
                          {value.toUpperCase()}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      id="min"
                      {...register('min')}
                      label="Minimum Odds"
                      size={'small'}
                      sx={{ width: 200 }}
                      type={'number'}
                    />

                    <TextField
                      id="max"
                      {...register('max')}
                      label="Maximum Odds"
                      size={'small'}
                      sx={{ width: 200 }}
                      type={'number'}
                    />
                    <Button variant={'contained'} type={'submit'}>
                      Load
                    </Button>
                  </div>
                </form>

                <GridToolbarContainer>
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              </div>
            );
          },
          loadingOverlay: LinearProgress,
        }}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        getRowClassName={(params) =>
          `super-app-theme--${
            params.row.adjustedTotal ||
            params.row.adjustedUnderOdds ||
            params.row.adjustedOverOdds
              ? 'Override'
              : ''
          }`
        }
        processRowUpdate={processRowUpdate}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [],
            },
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
