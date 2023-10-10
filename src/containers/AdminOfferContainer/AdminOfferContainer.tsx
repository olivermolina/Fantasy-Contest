import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import { OfferDataTable, OfferForm } from '~/components/Admin/Offer';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Prisma } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import BackdropLoading from '~/components/BackdropLoading';
import AdminMarketContainer from '~/containers/AdminMarketContainer';
import useTeams from '~/hooks/useTeams';
import { OfferWithTeams } from '~/components/Admin/Offer/OfferForm/OfferForm';
import PickDatePickerRange from '~/components/Picks/PickDatePickerRange';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

const AdminOfferContainer = () => {
  const router = useRouter();
  const from = router.query.from
    ? dayjs(router.query.from as string)
        .startOf('D')
        .toDate()
    : dayjs().subtract(1, 'month').startOf('D').toDate();
  const to = router.query.to
    ? dayjs(router.query.to as string)
        .startOf('D')
        .toDate()
    : dayjs().startOf('D').toDate();

  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<
    OfferWithTeams | undefined
  >(undefined);
  const {
    teams: homeTeams,
    isLoading: homeTeamIsLoading,
    setFilterName: homeTeamSetFilterName,
    mutateIsLoading: homeTeamMutateIsLoading,
    handleAddTeam,
    handleDeleteTeam,
  } = useTeams();

  const {
    teams: awayTeams,
    isLoading: awayTeamIsLoading,
    setFilterName: awayTeamSetFilterName,
    mutateIsLoading: awayTeamMutateIsLoading,
  } = useTeams();

  const handleClose = () => {
    setOpen(false);
  };

  const {
    isLoading,
    data,
    isFetching,
    fetchNextPage,
    refetch: refetchOffers,
  } = trpc.admin.offers.useInfiniteQuery(
    {
      limit: 10,
      to,
      from,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.offers) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const { mutateAsync: mutateAsyncOffer, isLoading: mutateOfferIsLoading } =
    trpc.admin.upsertOffer.useMutation();

  const {
    mutateAsync: mutateAsyncCopyOffer,
    isLoading: mutateOfferCopyIsLoading,
  } = trpc.admin.copyOffer.useMutation();

  const {
    mutateAsync: mutateAsyncDeleteOffer,
    isLoading: mutateOfferDeleteIsLoading,
  } = trpc.admin.deleteOffer.useMutation();

  const handleSave = async (offer: Prisma.OfferCreateInput) => {
    try {
      const newOffer = await mutateAsyncOffer(offer);
      // only refetch the first page
      refetchOffers({ refetchPage: (page, index) => index === 0 });
      setSelectedOffer(newOffer);
      const action = newOffer.gid === '' ? 'added' : 'updated';
      toast.success(`Offer successfully ${action} with ID: ${newOffer.gid}.`, {
        toastId: 'success',
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleEditOffer = (offer: OfferWithTeams) => {
    setSelectedOffer(offer);
    setOpen(true);
  };

  const handleAddNewOffer = () => {
    setSelectedOffer(undefined);
    setOpen(true);
  };

  const handleCopyOffer = async (id: string) => {
    try {
      await mutateAsyncCopyOffer({ id });
      await refetchOffers();
      toast.success('Offer successfully copied.');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      await mutateAsyncDeleteOffer({ id });
      await refetchOffers();
      toast.success('Offer successfully deleted.');
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  return (
    <>
      <h2 className={'text-xl font-bold'}>Offers</h2>
      <BackdropLoading
        open={
          homeTeamMutateIsLoading ||
          awayTeamMutateIsLoading ||
          mutateOfferCopyIsLoading ||
          mutateOfferDeleteIsLoading
        }
      />
      <div className={'flex flex-col gap-2 w-full'}>
        <PickDatePickerRange
          setDateRangeValue={({ startDate, endDate }) => {
            router.push({
              query: {
                from: startDate.startOf('D').toISOString(),
                to: endDate.startOf('D').toISOString(),
              },
            });
          }}
          dateRangeValue={{
            startDate: dayjs(from),
            endDate: dayjs(to),
          }}
        />
        <OfferDataTable
          flatData={flatData}
          isLoading={isLoading}
          totalDBRowCount={totalDBRowCount}
          totalFetched={totalFetched}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          handleEditOffer={handleEditOffer}
          handleNew={handleAddNewOffer}
          handleCopyOffer={handleCopyOffer}
          handleDeleteOffer={handleDeleteOffer}
        />
      </div>

      <Dialog open={open} maxWidth={'md'} fullWidth fullScreen>
        <div
          className={
            'flex flex-row justify-between items-center bg-blue-600 p-4'
          }
        >
          <h2 className={'text-2xl font-bold text-white'}>
            {selectedOffer ? 'Update' : 'Add'} Offer
          </h2>

          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 5,
              top: 5,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className={'flex flex-col'}>
          <OfferForm
            handleClose={handleClose}
            handleSave={handleSave}
            isLoading={mutateOfferIsLoading}
            mutationError=""
            handleAddTeam={handleAddTeam}
            handleDeleteTeam={handleDeleteTeam}
            offer={selectedOffer}
            homeTeamIsLoading={homeTeamIsLoading}
            awayTeamIsLoading={awayTeamIsLoading}
            homeTeams={homeTeams || []}
            awayTeams={awayTeams || []}
            homeTeamSetFilterName={homeTeamSetFilterName}
            awayTeamSetFilterName={awayTeamSetFilterName}
          />
          <AdminMarketContainer offer={selectedOffer} />
        </div>
      </Dialog>
    </>
  );
};

export default AdminOfferContainer;
