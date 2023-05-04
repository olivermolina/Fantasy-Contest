import {
  MessageInstance,
  MessageListInstance,
} from 'twilio/lib/rest/api/v2010/account/message';
import { smsClient } from './SMSClient';
import { smsService } from './SMSService';

// mock the client file
jest.mock('./SMSClient');

// fixture
const smsMessageResultMock: Partial<MessageInstance> = {
  status: 'sent',
  sid: 'AC-lorem-ipsum',
  errorCode: undefined,
  errorMessage: undefined,
};

describe('SMS Service', () => {
  beforeEach(() => {
    // stubs
    const message: Partial<MessageListInstance> = {
      create: jest.fn().mockResolvedValue({ ...smsMessageResultMock }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    smsClient['messages'] = message as MessageListInstance;
  });

  it('Should throw error if response message fails', async () => {
    // stubs
    const smsMessageMock = {
      ...smsMessageResultMock,
      status: 'failed',
      errorCode: 123,
      errorMessage: 'lorem-ipsum',
    };
    smsClient.messages.create = jest
      .fn()
      .mockResolvedValue({ ...smsMessageMock });

    await expect(
      smsService.sendMessage({
        to: '(555) 555-5555',
        body: 'lorem-ipsum',
      }),
    ).rejects.toThrowError(
      `Failed to send sms message. Error Code: ${smsMessageMock.errorCode} / Error Message: ${smsMessageMock.errorMessage}`,
    );
  });

  describe('Send Message', () => {
    it('Should succeed when posting the message', async () => {
      const resultPromise = smsService.sendMessage({
        to: '(555) 555-5555',
        body: 'lorem-ipsum',
      });
      await expect(resultPromise).resolves.not.toThrowError(Error);
      expect(await resultPromise).toEqual(smsMessageResultMock.sid);
    });
  });
});
