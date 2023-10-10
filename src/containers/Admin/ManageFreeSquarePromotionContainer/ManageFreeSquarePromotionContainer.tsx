import React, { useMemo, useState } from 'react';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import { ContestType, League } from '@prisma/client';
import { MORE_OR_LESS_CONTEST_ID } from '~/constants/MoreOrLessContestId';
import ManageFreeSquarePromotion from '~/components/Pages/Admin/ManageFreeSquarePromotion/ManageFreeSquarePromotion';
import { AddFreeSquarePromotionInput } from '~/components/Pages/Admin/ManageFreeSquarePromotion/EditFreeSquarePromotionDialog';
import { toast } from 'react-toastify';
import { getMarketTotalProjection } from '~/utils/getMarketTotalProjection';

export const ManageFreeSquarePromotionContainer = () => {
  const { data: contestCategories } =
    trpc.contest.contestCategoryList.useQuery();
  const [selectedLeague, setSelectedLeague] = useState<League>(League.NBA);

  const { isLoading, data, refetch } = trpc.contest.listOffers.useQuery(
    {
      contestId: MORE_OR_LESS_CONTEST_ID,
      league: selectedLeague as League,
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
  const mutation = trpc.admin.addFreeSquarePromotion.useMutation();

  const deleteMutation = trpc.admin.deleteFreeSquarePromotion.useMutation();

  const saveFreeSquarePromotion = async (
    formData: AddFreeSquarePromotionInput,
  ) => {
    try {
      await mutation.mutateAsync(formData);
      await refetch();
      toast.success(
        `Free square promotion saved successfully with market id: ${formData.marketId}.`,
      );
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
    }
  };
  const handleDelete = async (id: string, league: League) => {
    try {
      await deleteMutation.mutateAsync({ id, league });
      await refetch();
      toast.success(`Free square promotion deleted successfully.`);
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const memoizedData = useMemo(() => {
    if (data?.type !== ContestType.FANTASY) {
      return [];
    }

    return data?.offers
      .filter((offer) => offer.type === 'PP')
      .map((offer) => ({
        id: offer!.id,
        selId: offer!.selId,
        league: offer!.league,
        playerName: offer!.playerName,
        statName: offer!.statName,
        total: offer!.total,
        matchTime: offer!.matchTime,
        matchName: offer!.matchName,
        freeSquare: offer!.freeSquare,
        freeSquareDiscount: offer!.freeSquare?.discount || 0,
        maxStake: offer!.freeSquare?.maxStake || 0,
        freeEntryEnabled: offer!.freeSquare?.freeEntryEnabled || false,
        discountedTotal: getMarketTotalProjection(
          offer!.total,
          offer!.freeSquare,
        ),
        picksCategory:
          offer!.freeSquare?.pickCategories
            ?.map((pickCategory) => pickCategory.numberOfPicks)
            .toString() || '',
      }));
  }, [data]);

  return (
    <>
      <BackdropLoading
        open={isLoading || mutation.isLoading || deleteMutation.isLoading}
      />
      <ManageFreeSquarePromotion
        data={memoizedData}
        selectedLeague={selectedLeague}
        setSelectedLeague={setSelectedLeague}
        contestCategories={contestCategories || []}
        handleSave={saveFreeSquarePromotion}
        handleDelete={handleDelete}
      />
    </>
  );
};
