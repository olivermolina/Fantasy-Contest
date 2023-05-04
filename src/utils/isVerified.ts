import { ReasonCodes } from '~/lib/tsevo-gidx/ReasonCodes';

/**
 * Will check if the user is verified based of the monitor response code
 */
export const isVerified = (responseReasonCodes: [string]) => {
  if (!responseReasonCodes) return false;
  return responseReasonCodes.includes(ReasonCodes.ID_VERIFIED);
};
