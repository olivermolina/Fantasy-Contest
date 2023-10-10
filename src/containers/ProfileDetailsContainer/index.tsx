import React from 'react';
import { ProfileDetails } from '~/components/Profile';
import { useAppSelector } from '~/state/hooks';
import DeleteAccountDialog, {
  DeleteAccountInput,
} from '~/components/Profile/ProfileDetails/DeleteAccountDialog';
import { trpc } from '~/utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import BackdropLoading from '~/components/BackdropLoading';

const ProfileDetailsContainer = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const userDetails = useAppSelector((state) => state.profile.userDetails);

  const [open, setOpen] = React.useState(false);
  const openDeleteAccount = () => setOpen(true);
  const closeDeleteAccount = () => setOpen(false);
  const mutation = trpc.user.deleteUser.useMutation();
  const deleteUserAccount = async (input: DeleteAccountInput) => {
    try {
      const data = await mutation.mutateAsync(input);
      if (data) {
        await supabaseClient.auth.signOut();
        await router.push('/auth/login');
      }
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(
        e?.message || `Oops! Something went wrong! Please try again later.`,
      );
    }
  };

  return (
    <>
      <BackdropLoading open={mutation.isLoading} />
      <ProfileDetails {...userDetails} openDeleteAccount={openDeleteAccount} />
      <DeleteAccountDialog
        open={open}
        close={closeDeleteAccount}
        deleteAccount={deleteUserAccount}
      />
    </>
  );
};

export default ProfileDetailsContainer;
