import { CustomErrorMessages } from '~/constants/CustomErrorMessages';

export const getErrorMessage = (responseReasonCodes: string[]) => {
  let errorMessage = '';
  for (const responseReasonCode of responseReasonCodes) {
    errorMessage =
      CustomErrorMessages[
        responseReasonCode as keyof typeof CustomErrorMessages
      ];

    if (errorMessage) break;
  }
  return errorMessage || CustomErrorMessages.GIDX_DEFAULT;
};
