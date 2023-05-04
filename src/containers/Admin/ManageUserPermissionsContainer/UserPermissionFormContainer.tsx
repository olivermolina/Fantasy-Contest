import React from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import { AppBar, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserPermissionsForm, {
  UserPermissionFormInputs,
} from '~/components/Pages/Admin/ManageUserPermissions/UserPermissionsForm';
import { ManageAgentRowModel } from '~/components/Pages/Admin/ManageUserPermissions/ManageUserPermissions';
import { toast } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';

export const UserPermissionFormContainer = ({
  user,
  open,
  handleClose,
}: {
  user: ManageAgentRowModel;
  open: boolean;
  handleClose: () => void;
}) => {
  const { data, isLoading } = trpc.admin.getModulePermissions.useQuery({
    userId: user.id,
  });
  const mutation = trpc.admin.saveModulePermissions.useMutation();

  const onSubmit = async (formInputs: UserPermissionFormInputs) => {
    try {
      await mutation.mutateAsync(formInputs);
      handleClose();
      toast.success(`Saved successfully!`);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };

  return (
    <>
      <BackdropLoading open={isLoading} />

      <Dialog
        open={open && !!data}
        onClose={handleClose}
        fullWidth
        maxWidth={'lg'}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              User: {user.username}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <UserPermissionsForm
          userId={user.id}
          onSubmit={onSubmit}
          userPermissions={data || []}
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
};
