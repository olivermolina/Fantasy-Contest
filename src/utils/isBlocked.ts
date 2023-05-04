import { ReasonCodes } from '~/lib/tsevo-gidx/ReasonCodes';

/**
 * Will check if the user is blocked based of the monitor response code
 */
export const isBlocked = (responseReasonCodes: [string]) => {
  if (!responseReasonCodes) return true;
  const blockedReasonCodesResponse = Object.values(ReasonCodes).filter(
    (reasonCode) =>
      responseReasonCodes.indexOf(reasonCode) !== -1 &&
      reasonCode !== ReasonCodes.ID_VERIFIED,
  );

  return blockedReasonCodesResponse.length > 0;
};
