import axios, { AxiosError } from 'axios';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import { PaymentMethodType, Session, Transaction, User } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { startCase } from 'lodash';
import { ActionType } from '~/constants/ActionType';
import logger from '~/utils/logger';
import HttpsProxyAgent from 'https-proxy-agent';

enum GIDX_ROUTES {
  DIRECT_CASHIER = 'DirectCashier',
  CUSTOMER_IDENTITY = 'CustomerIdentity',
}

const httpsAgent = new (HttpsProxyAgent as any)(
  `${process.env.STATIC_IP_OUTBOUND_PROXY}:9293`,
);

const isClient = typeof window !== 'undefined';

const gidxClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_GIDX_DIRECT_CASHIER_API_URL
      : process.env.SANDBOX_GIDX_DIRECT_CASHIER_API_URL,
  ...(isClient
    ? {
        proxy: {
          host: `${process.env.STATIC_IP_OUTBOUND_PROXY}`,
          port: 9293,
        },
      }
    : { proxy: false, httpsAgent }),
});

const GIDX_CALLBACK_STATUS_URL = `${process.env.STATIC_IP_INBOUND_PROXY}/api/gidxCallback`;

export interface GIDXDataBaseResponse {
  MerchantSessionID: string;
  MerchantTransactionID: string;
  SessionID: string;
  ReasonCodes: [string];
  ResponseCode?: number;
  ResponseMessage?: string;
  PaymentMethods?: GIDXPaymentMethod[];
  PaymentMethod?: GIDXPaymentMethod;
  StatusCode?: number;
  StatusMessage?: string;
  SessionScore?: number;
  ServiceType?: string;
  TransactionStatusCode?: number;
  TransactionStatusMessage?: string;
  SessionStatusMessage?: string;
  SessionStatusCode?: string;
  PaymentDetails: GIDXPaymentDetail[];
  Action: GIDXAction;
}

interface GIDXResponse {
  data: GIDXDataBaseResponse;
}

export const gidxRequest = async ({ ...options }): Promise<GIDXResponse> => {
  gidxClient.defaults.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    ...options.headers,
  };

  const standardParameters =
    process.env.NODE_ENV === 'production'
      ? {
          MerchantID: process.env.PRODUCTION_GIDX_MERCHANT_ID || '',
          ApiKey: process.env.PRODUCTION_GIDX_API_KEY || '',
          ProductTypeID: process.env.PRODUCTION_GIDX_PRODUCT_ID || '',
          DeviceTypeID: process.env.PRODUCTION_GIDX_DEVICE_ID || '',
          ActivityTypeID: process.env.PRODUCTION_GIDX_ACTIVITY_ID || '',
        }
      : {
          MerchantID: process.env.SANDBOX_GIDX_MERCHANT_ID || '',
          ApiKey: process.env.SANDBOX_GIDX_API_KEY || '',
          ProductTypeID: process.env.SANDBOX_GIDX_PRODUCT_ID || '',
          DeviceTypeID: process.env.SANDBOX_GIDX_DEVICE_ID || '',
          ActivityTypeID: process.env.SANDBOX_GIDX_ACTIVITY_ID || '',
        };

  return new Promise((resolve, reject) => {
    gidxClient({
      ...options,
      ...(options.method === 'GET' && {
        params: {
          ...options.params,
          ...standardParameters,
        },
      }),
      ...(options.method !== 'GET' && {
        data: {
          ...options.data,
          ...standardParameters,
        },
      }),
    })
      .then((response: any) => resolve(response))
      .catch((error: Error | AxiosError) => reject(error));
  });
};

export interface IDeviceGPS {
  /**
   * Customer latitude
   * @example 36.169727
   */
  Latitude: number;
  /**
   * Customer longitude
   * @example -115.141801
   */
  Longitude: number;
  /**
   *
   * Customer approximate distance
   * @example 600.999
   */
}

export type BillingAddressInterface = {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countyCode?: string;
};

export interface CreditCardPaymentMethodInterface {
  token?: string;
  cardNumber?: string;
  cardExpirationDate?: string;
  cvv: number;
  cardType?: string;
}

export interface ACHPaymentMethodInterface {
  token?: string;
  accountNumber?: string;
  routingNumber?: string;
}

export interface PaypalPaymentMethodInterface {
  email?: string;
}

export interface GidxPaymentMethodInterface {
  type?: PaymentMethodType;
  creditCard?: CreditCardPaymentMethodInterface;
  ach?: ACHPaymentMethodInterface;
  paypal?: PaypalPaymentMethodInterface;
}

export interface UserDetailsInput extends BillingAddressInterface {
  firstname: string;
  lastname: string;
  dob: string | Dayjs;
}

export interface GIDXAddress {
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  StateCode: string;
  PostalCode: string;
  Primary: boolean;
}

export interface GIDXName {
  FirstName: string;
  LastName: string;
  Primary: boolean;
}

export interface GIDXDateOfBirth {
  DateOfBirth: string;
  Primary: boolean;
}

export interface CustomerProfileResponse extends GIDXDataBaseResponse {
  Name: GIDXName[];
  Address: GIDXAddress[];
  DateOfBirth: GIDXDateOfBirth[];
}

export interface GIDXPaymentMethod {
  Type: string;
  Token: string;
  NameOnAccount: string;
  DisplayName: string;
  ExpirationDate?: string;
  CardNumber?: string;
  AccountNumber?: string;
  RoutingNumber?: string;
  Network?: string;
  BillingAddress?: GIDXAddress;
}

interface GIDXAction {
  ClientID?: string;
  OrderID?: string;
  Type?: string;
  URL?: string;
}

interface GIDXPaymentDetail {
  PaymentMethodAccount: string;
  PaymentMethod: GIDXPaymentMethod;
  PaymentStatusCode: number;
  FinancialConfidenceScore: number;
  PaymentApprovalDateTime: string;
  PaymentStatusDateTime: string;
  PaymentStatusMessage: string;
  PaymentProcessDateTime: string;
}

const createSessionResponseLog = async (
  sessionId: string,
  data: GIDXDataBaseResponse,
) => {
  // Log session response
  await prisma.sessionResponse.create({
    data: {
      sessionId,
      reasonCodes: data?.ReasonCodes || [],
      statusMessage: data?.StatusMessage || '',
      statusCode: data?.StatusCode || 0,
      sessionResponseRaw: JSON.stringify(data),
    },
  });
};

interface CompleteSessionInputInterface {
  fullName: string;
  transaction: Transaction;
  paymentMethod: GidxPaymentMethodInterface;
  billingAddress: BillingAddressInterface;
  amountProcess: number;
  amountBonus: number;
}

interface SavePaymentMethodInputInterface {
  fullName: string;
  paymentMethod: GidxPaymentMethodInterface;
  billingAddress: BillingAddressInterface;
  save: boolean;
}

export default class GIDX {
  user: User;
  actionType: ActionType;
  session: Session;

  constructor(user: User, actionType: ActionType, session: Session) {
    this.user = user;
    this.actionType = actionType;
    this.session = session;
  }

  async createSession(
    transaction: Transaction,
    ipAddress: string,
    deviceGPS: IDeviceGPS,
  ) {
    logger.info('CreateSession', { transaction, ipAddress, deviceGPS });
    const session = this.session;
    // Create GIDX session for DirectCashier
    const sessionData = {
      MerchantSessionID: session.id,
      MerchantOrderID: `${transaction.id}-${new Date().getTime()}`,
      MerchantTransactionID: transaction.id,
      PayActionCode: this.actionType || ActionType.PAY,
      CustomerIpAddress: ipAddress,
      DeviceGPS: deviceGPS,
      CallbackURL: GIDX_CALLBACK_STATUS_URL,
      MerchantCustomerID: this.user.id,
    };

    // Update sessionRequestRaw field
    await prisma.session.update({
      data: {
        sessionRequestRaw: JSON.stringify(sessionData),
      },
      where: {
        id: session.id,
      },
    });

    const { data: createSessionData } = await gidxRequest({
      url: `${GIDX_ROUTES.DIRECT_CASHIER}/CreateSession`,
      method: 'POST',
      data: sessionData,
    });

    // Log session response
    await createSessionResponseLog(session.id, createSessionData);

    return createSessionData;
  }

  async completeSession(inputs: CompleteSessionInputInterface) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }
    const user = this.user;
    const {
      fullName,
      paymentMethod,
      transaction,
      billingAddress,
      amountProcess,
      amountBonus,
    } = inputs;

    const cardType = startCase(paymentMethod.creditCard?.cardType);
    const cardDetails = {
      ...(paymentMethod.creditCard?.token
        ? {
            Token: paymentMethod.creditCard?.token,
          }
        : {
            CardNumber: paymentMethod.creditCard?.cardNumber,
            ExpirationDate: paymentMethod.creditCard?.cardExpirationDate,
          }),
      CVV: paymentMethod.creditCard?.cvv,
      Network: cardType,
    };

    const achDetails = paymentMethod.ach?.token
      ? {
          Token: paymentMethod.ach?.token,
        }
      : {
          AccountNumber: paymentMethod.ach?.accountNumber,
          RoutingNumber: paymentMethod.ach?.routingNumber,
        };

    const paypalDetails = {
      EmailAddress: paymentMethod?.paypal?.email,
    };

    const requestData = {
      MerchantSessionID: this.session.id,
      MerchantTransactionID: transaction.id,
      SavePaymentMethod: true,
      PaymentMethod: {
        NameOnAccount: fullName,
        Type: paymentMethod.type,
        ...(paymentMethod.type === PaymentMethodType.CC && cardDetails),
        ...(paymentMethod.type === PaymentMethodType.ACH && achDetails),
        ...(paymentMethod.type === PaymentMethodType.Paypal &&
          this.actionType === ActionType.PAYOUT &&
          paypalDetails),
        PhoneNumber: user.phone?.toString(),
        BillingAddress: {
          AddressLine1: billingAddress.address1,
          AddressLine2: billingAddress.address2,
          City: billingAddress.city,
          StateCode: billingAddress.state,
          PostalCode: billingAddress.postalCode,
          CountryCode: 'US',
        },
      },
      PaymentAmount: {
        PaymentAmount: amountProcess,
        BonusAmount: amountBonus,
      },
    };

    // Update completeSessionRequestRaw field
    await prisma.session.update({
      data: {
        completeSessionRequestRaw: JSON.stringify(requestData),
      },
      where: {
        id: this.session.id,
      },
    });

    // Complete Session
    const { data } = await gidxRequest({
      url: `${GIDX_ROUTES.DIRECT_CASHIER}/CompleteSession`,
      method: 'POST',
      data: requestData,
    });

    // Log session response
    await createSessionResponseLog(this.session.id, data);

    if (!data || data.ResponseCode !== 0) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: data.ResponseMessage,
      });
    }

    return data;
  }

  async register(
    userDetails: UserDetailsInput,
    deviceGPS: IDeviceGPS,
    ipAddress: string,
  ) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }

    try {
      const { id, email } = this.user;
      const requestData = {
        MerchantSessionID: this.session.id,
        DeviceGPS: deviceGPS,
        DeviceIpAddress: ipAddress,
        MerchantCustomerID: id,
        FirstName: userDetails.firstname,
        LastName: userDetails.lastname,
        DateOfBirth: dayjs(userDetails.dob).format('MM/DD/YYYY'),
        EmailAddress: email,
        AddressLine1: userDetails.address1,
        AddressLine2: userDetails.address2,
        City: userDetails.city,
        StateCode: userDetails.state,
        PostalCode: userDetails.postalCode,
        CountryCode: 'US',
        CitizenshipCountryCode: 'US',
      };

      // Update sessionRequestRaw field
      await prisma.session.update({
        data: {
          serviceType: ActionType.CUSTOMER_REGISTRATION,
          sessionRequestRaw: JSON.stringify(requestData),
        },
        where: {
          id: this.session.id,
        },
      });

      const response = await gidxRequest({
        url: `${GIDX_ROUTES.CUSTOMER_IDENTITY}/CustomerRegistration`,
        method: 'POST',
        data: requestData,
      });

      const { data } = response;

      // Log session response
      await createSessionResponseLog(this.session.id, data);
      return data;
    } catch (err: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
  }

  async getCustomerProfile(deviceGPS: IDeviceGPS, ipAddress: string) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }

    try {
      const requestData = {
        MerchantSessionID: this.session.id,
        MerchantCustomerID: this.user.id,
        CustomerIpAddress: ipAddress,
        DeviceGPS: deviceGPS,
      };

      // Update sessionRequestRaw field
      await prisma.session.update({
        data: {
          sessionRequestRaw: JSON.stringify(requestData),
        },
        where: {
          id: this.session.id,
        },
      });

      const response = await gidxRequest({
        url: `${GIDX_ROUTES.CUSTOMER_IDENTITY}/CustomerProfile`,
        method: 'GET',
        params: requestData,
      });
      const { data } = response;
      await prisma.session.update({
        data: {
          serviceType: ActionType.GET_CUSTOMER_PROFILE,
        },
        where: {
          id: this.session.id,
        },
      });
      // Log session response
      await createSessionResponseLog(this.session.id, data);
      return data as CustomerProfileResponse;
    } catch (err: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
  }

  async savePaymentMethod(input: SavePaymentMethodInputInterface) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }
    const user = this.user;
    const { paymentMethod, billingAddress, fullName, save } = input;

    const cardType = startCase(paymentMethod.creditCard?.cardType);
    const cardPaymentDetails = {
      ...(paymentMethod.creditCard?.token
        ? {
            Token: paymentMethod.creditCard?.token,
          }
        : {
            CardNumber: paymentMethod.creditCard?.cardNumber,
            ExpirationDate: paymentMethod.creditCard?.cardExpirationDate,
          }),
      CVV: paymentMethod.creditCard?.cvv,
      Network: cardType,
    };

    const achPaymentDetails = paymentMethod.ach?.token
      ? {
          Token: paymentMethod.ach?.token,
        }
      : {
          AccountNumber: paymentMethod.ach?.accountNumber,
          RoutingNumber: paymentMethod.ach?.routingNumber,
        };

    const requestData = {
      MerchantCustomerID: this.user.id,
      MerchantSessionID: this.session.id,
      SavePaymentMethod: save,
      PaymentMethod: {
        Type: paymentMethod.type,
        ...(paymentMethod.type === PaymentMethodType.CC && cardPaymentDetails),
        ...(paymentMethod.type === PaymentMethodType.ACH && achPaymentDetails),
        ...(save && {
          NameOnAccount: fullName,
          PhoneNumber: user.phone?.toString(),
          BillingAddress: {
            AddressLine1: billingAddress.address1,
            AddressLine2: billingAddress.address2,
            City: billingAddress.city,
            StateCode: billingAddress.state,
            PostalCode: billingAddress.postalCode,
            CountryCode: 'US',
          },
        }),
      },
    };

    // Save Payment Method request
    const { data } = await gidxRequest({
      url: `${GIDX_ROUTES.DIRECT_CASHIER}/PaymentMethod`,
      method: 'POST',
      data: requestData,
    });

    await prisma.session.update({
      data: {
        serviceType: ActionType.SAVE_PAYMENT_METHOD,
      },
      where: {
        id: this.session.id,
      },
    });

    // Log session response
    await createSessionResponseLog(this.session.id, data);

    if (!data || data.ResponseCode !== 0) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: data.ResponseMessage,
      });
    }
    return data.PaymentMethod;
  }

  async paymentDetail(transactionId: string) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }

    try {
      const requestData = {
        MerchantSessionID: this.session.id,
        MerchantCustomerID: this.user.id,
        MerchantTransactionID: transactionId,
      };

      const response = await gidxRequest({
        url: `${GIDX_ROUTES.DIRECT_CASHIER}/PaymentDetail`,
        method: 'GET',
        params: requestData,
      });
      const { data } = response;

      await prisma.session.update({
        data: {
          serviceType: ActionType.PAYMENT_DETAILS,
        },
        where: {
          id: this.session.id,
        },
      });

      // Log session response
      await createSessionResponseLog(this.session.id, data);
      return data;
    } catch (err: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
  }

  async customerMonitor(input: { ipAddress: string; deviceGPS: IDeviceGPS }) {
    if (!this.session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session',
      });
    }

    try {
      const requestData = {
        MerchantSessionID: this.session.id,
        MerchantCustomerID: this.user.id,
        CustomerIpAddress: input.ipAddress,
        DeviceGPS: input.deviceGPS,
      };

      // Update sessionRequestRaw field
      await prisma.session.update({
        data: {
          serviceType: ActionType.CUSTOMER_MONITOR,
          sessionRequestRaw: JSON.stringify(requestData),
        },
        where: {
          id: this.session.id,
        },
      });

      const response = await gidxRequest({
        url: `${GIDX_ROUTES.CUSTOMER_IDENTITY}/CustomerMonitor`,
        method: 'GET',
        params: requestData,
      });
      const { data } = response;
      // Log session response
      await createSessionResponseLog(this.session.id, data);
      return data as CustomerProfileResponse;
    } catch (err: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
  }
}
