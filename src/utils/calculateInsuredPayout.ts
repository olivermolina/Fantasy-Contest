import { ContestCategory } from '@prisma/client';

export interface InsuredPayout {
  primaryInsuredPayout: number;
  secondaryInsuredPayout: number;
}

export function calculateInsuredPayout(
  stake: number,
  contestCategory: ContestCategory,
): InsuredPayout {
  const primaryInsuredPayout =
    contestCategory.primaryInsuredPayoutMultiplier * stake;
  const secondaryInsuredPayout =
    contestCategory.secondaryInsuredPayoutMultiplier * stake;
  return {
    primaryInsuredPayout,
    secondaryInsuredPayout,
  };
}
