/*
 * GIDX reason codes http://www.tsevo.com/Docs/Integration#GetFamiliar_ID_ReasonCodes
 */
export enum ReasonCodes {
  ID_VERIFIED = 'ID-VERIFIED',
  ID_UA18 = 'ID-UA18',
  ID_EX = 'ID-EX',
  ID_BLOCK = 'ID-BLOCK',
  ID_DECEASED = 'ID-DECEASED',
  ID_HR = 'ID-HR',
  ID_HVEL_ACTV = 'ID-HVEL-ACTV',
  ID_AGE_UNKN = 'ID-AGE-UNKN',
  ID_WL = 'ID-WL',
  ID_ADDR_UPA = 'ID-ADDR-UPA',
  DFP_VPRP = 'DFP-VPRP',
  DFP_HR_CONN = 'DFP-HR-CONN',
  LL_BLOCK = 'LL-BLOCK',
}

export const BlockedReasonCodesArray = Object.values(ReasonCodes).filter(
  (reasonCode) => reasonCode !== ReasonCodes.ID_VERIFIED,
);
