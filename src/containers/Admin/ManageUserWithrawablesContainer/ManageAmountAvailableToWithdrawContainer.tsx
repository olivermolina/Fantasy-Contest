import React, { useMemo } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import ManageAmountAvailableToWithdraw, {
  UserWalletRow,
} from '~/components/Pages/Admin/ManageAmountAvailableToWithdraw/ManageAmountAvailableToWithdraw';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';

export default function ManageAmountAvailableToWithdrawContainer() {
  const { data, isLoading, refetch } = trpc.user.users.useQuery();
  const mutation = trpc.admin.saveUserWallet.useMutation();

  const saveUserWallet = async (userWallet: UserWalletRow) => {
    try {
      await mutation.mutateAsync(userWallet);
      refetch();
      toast.success(`${userWallet.username} balances updated successfully`);
    } catch (e) {}
  };

  const usersTableData = useMemo(() => {
    if (!data) return [];

    return data.map(
      (user) =>
        ({
          id: user.id,
          username: user.username || '',
          balance: Number(user.Wallets?.[0]?.balance),
          cashBalance: Number(user.Wallets?.[0]?.cashBalance),
          bonusCredits: Number(user.Wallets?.[0]?.bonusCredits),
          amountAvailableToWithdraw: Number(
            user.Wallets?.[0]?.amountAvailableToWithdraw,
          ),
        } as UserWalletRow),
    );
  }, [data]);

  return (
    <>
      <BackdropLoading open={false} />

      <ManageAmountAvailableToWithdraw
        users={usersTableData}
        isLoading={isLoading || mutation.isLoading}
        saveUserWallet={saveUserWallet}
      />
    </>
  );
}
