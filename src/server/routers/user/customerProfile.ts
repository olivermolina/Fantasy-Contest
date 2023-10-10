import { Session, User } from '@prisma/client';
import GIDX, {
  CustomerProfileResponse,
  IDeviceGPS,
} from '~/lib/tsevo-gidx/GIDX';
import { ActionType } from '~/constants/ActionType';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { isVerified } from '~/utils/isVerified';
import { CustomErrorMessages } from '~/constants/CustomErrorMessages';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

export const customerProfile = async (input: {
  user: User;
  session: Session;
  deviceGPS: IDeviceGPS;
  ipAddress: string;
}) => {
  const { user, session, deviceGPS, ipAddress } = input;
  const userId = user.id;
  const gidx = await new GIDX(user, ActionType.GET_CUSTOMER_PROFILE, session);
  const customerProfile: CustomerProfileResponse =
    await gidx.getCustomerProfile(deviceGPS, ipAddress);

  // Get primary name, address and DOB
  const primaryName = customerProfile.Name.find((name) => name.Primary);
  const primaryDob = customerProfile.DateOfBirth.find((dob) => dob.Primary);
  const primaryAddress = customerProfile.Address.find(
    (address) => address.Primary,
  );

  if (!primaryName || !primaryAddress || !primaryDob) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: CustomErrorMessages.USER_ACCOUNT_DETAILS_NOT_FOUND,
    });
  }

  const userDetails = {
    firstname: primaryName.FirstName,
    lastname: primaryName.LastName,
    address1: primaryAddress.AddressLine1,
    address2: primaryAddress.AddressLine2,
    city: primaryAddress.City,
    state: primaryAddress.StateCode,
    postalCode: primaryAddress.PostalCode,
  };

  // Update user information with the primary details
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...userDetails,
      identityStatus: isVerified(customerProfile.ReasonCodes),
      reasonCodes: customerProfile.ReasonCodes,
      DOB: dayjs.tz(primaryDob.DateOfBirth, 'America/New_York').toDate(),
    },
  });

  return {
    ...userDetails,
    dob: primaryDob.DateOfBirth,
    reasonCodes: customerProfile.ReasonCodes,
  };
};
