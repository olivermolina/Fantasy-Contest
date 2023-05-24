import React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { User, UserStatus } from '@prisma/client';
import { Button, Checkbox, FormControlLabel, Stack } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import ControlledCheckbox from './ControlledCheckbox';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { UserDetails } from '~/state/profile';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled(
  ({
    toggleAccordion,
    ...props
  }: AccordionSummaryProps & {
    toggleAccordion: () => void;
  }) => (
    <MuiAccordionSummary
      sx={{ cursor: 'unset !important' }}
      expandIcon={
        <ArrowForwardIosSharpIcon
          onClick={toggleAccordion}
          sx={{ fontSize: '0.9rem', cursor: 'pointer' }}
        />
      }
      {...props}
    />
  ),
)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export type ManageAgentRowModel = Pick<User, 'id' | 'username' | 'status'>;

type Props = {
  subAdmin: ManageAgentRowModel;
  agents: readonly ManageAgentRowModel[];
  handleOpenManagePermission: (user: ManageAgentRowModel) => void;
  user?: UserDetails;
};

export default function ManageUserPermissions(props: Props) {
  const [expand, setExpand] = React.useState(false);
  const toggleAccordion = () => {
    setExpand((prev) => !prev);
  };
  const rows: GridRowsProp<ManageAgentRowModel> = props.agents;
  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'id',
      headerName: 'ID',
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    { flex: 1, field: 'username', headerName: 'Username' },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        //TODO onClick save user status to db
        return (
          <ControlledCheckbox
            checked={currentRow.status === UserStatus.ACTIVE}
          />
        );
      },
    },
    {
      flex: 1,
      field: 'manage',
      headerName: 'Manage Rights',

      renderCell: (params) => {
        const currentRow = params.row as (typeof rows)[0];
        const onClick = () => {
          props.handleOpenManagePermission(currentRow);
        };

        return (
          <Stack direction="row" spacing={2}>
            <Button
              color="warning"
              size="small"
              onClick={onClick}
              variant={'contained'}
            >
              Manage Rights
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Accordion expanded={expand} disableGutters>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        toggleAccordion={toggleAccordion}
      >
        <span className={'font-semibold flex-grow align-middle mt-2'}>
          PAM: {props.subAdmin.username}
        </span>
        {props.subAdmin.id !== 'unassigned' && props.user?.type === 'ADMIN' && (
          <>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={(e) => e.stopPropagation}
                  />
                }
                label="Status"
              />
            </FormGroup>
            <Button
              color="warning"
              size="small"
              sx={{ height: 35 }}
              variant={'contained'}
              onClick={(e) => {
                e.stopPropagation();
                props.handleOpenManagePermission(props.subAdmin);
              }}
            >
              Manage Rights
            </Button>
          </>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <div className={'flex flex-col gap-2'}>
          <span className={'font-semibold text-lg'}>Partners</span>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.id}
              rows={rows}
              columns={columns}
            />
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
