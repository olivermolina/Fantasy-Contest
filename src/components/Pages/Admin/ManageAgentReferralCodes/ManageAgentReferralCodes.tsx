import React, { useMemo, useState } from 'react';
import UserAutocomplete from '~/components/Admin/Management/UserAutocomplete';
import { useForm } from 'react-hook-form';
import { ManagementBaseProps } from '~/components/Admin/Management/Management';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ReferralCode, User, UserType } from '@prisma/client';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialog from './DeleteDialog';

const InputValidationSchema = Yup.object().shape({
  user: Yup.object()
    .typeError('Please select user')
    .required('Please select user'),
  referral: Yup.string().required('Referral code is required.'),
});

type UserWithReferralCode = User & { referralCodes: ReferralCode[] };

export interface ManageUserAgentInputs {
  user: User | string;
  referral: string;
}

interface ManageUserAgentProps extends ManagementBaseProps {
  /**
   * Submit form function
   */
  onSubmit: (inputs: ManageUserAgentInputs) => void;
  /**
   * Callback function to delete referral code
   * @param referralCodeId
   */
  deleteReferralCode: (userId: string, referralCode: string) => void;
}

export default function ManageAgentReferralCodes(props: ManageUserAgentProps) {
  const [, setUserId] = useState<string | undefined>();
  const [selectedReferral, setSelectedReferralCode] = useState('');
  const { users, isLoading, onSubmit, deleteReferralCode } = props;

  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const openAddReferralCodeDialog = () => {
    setOpen(true);
  };
  const closeAddReferralCodeDialog = () => {
    setValue('referral', '');
    setOpen(false);
  };
  const openDeleteReferralCodeDialog = (referralCode: string) => {
    setSelectedReferralCode(referralCode);
    setOpenDeleteDialog(true);
  };
  const closeDeleteReferralCodeDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedReferralCode('');
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ManageUserAgentInputs>({
    resolver: yupResolver(InputValidationSchema),
    mode: 'all',
  });

  const addNewReferralCode = () => {
    handleSubmit(onSubmit)();
    closeAddReferralCodeDialog();
  };
  const user = watch('user') as UserWithReferralCode;

  const agentReferralCodes = useMemo(
    () =>
      users
        ?.find((agent) => agent.id === user?.id)
        ?.referralCodes.map((referral) => referral.code),
    [user, users],
  );

  const confirmDeleteReferralCode = (referralCode: string) => {
    deleteReferralCode(user.id, referralCode);
    closeDeleteReferralCodeDialog();
  };

  return (
    <form>
      <div className={'flex flex-col gap-4 p-4 shadow-lg'}>
        <p className={'text-lg font-semibold'}>Agent Referral Codes</p>
        <div className={'flex flex-col gap-4'}>
          <UserAutocomplete
            control={control}
            users={users.filter((user) => user.type === UserType.AGENT)}
            isLoading={isLoading}
            setSelectedUserId={setUserId}
            label={'Select Agent'}
          />
        </div>

        {isLoading ? (
          <div className={'flex flex-wrap gap-2'}>
            <Skeleton variant="rounded" width={45} height={30} />
            <Skeleton variant="rounded" width={60} height={30} />
            <Skeleton variant="rounded" width={50} height={30} />
          </div>
        ) : (
          <div className={'flex flex-wrap gap-2'}>
            {user && <Chip label={user.username} variant="outlined" />}
            {agentReferralCodes?.map((referralCode) => (
              <Chip
                key={referralCode}
                label={referralCode}
                onDelete={() => openDeleteReferralCodeDialog(referralCode)}
                deleteIcon={<DeleteIcon />}
                variant="outlined"
              />
            ))}
            {user && (
              <Chip
                label={<AddIcon />}
                onClick={openAddReferralCodeDialog}
                variant="outlined"
              />
            )}
          </div>
        )}
      </div>
      <Dialog open={open} onClose={closeAddReferralCodeDialog}>
        <DialogTitle>Add New Referral Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Referral Code"
            fullWidth
            variant="standard"
            {...register('referral')}
            error={!!errors?.referral}
            helperText={errors?.referral?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddReferralCodeDialog} variant={'outlined'}>
            Cancel
          </Button>
          <Button onClick={addNewReferralCode} variant={'contained'}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteDialog
        open={openDeleteDialog}
        confirmDelete={confirmDeleteReferralCode}
        referral={selectedReferral}
        closeDialog={closeDeleteReferralCodeDialog}
      />
    </form>
  );
}
