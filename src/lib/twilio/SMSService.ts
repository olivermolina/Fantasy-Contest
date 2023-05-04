import { smsClient } from './SMSClient';

interface ISendSMSRequest {
  /**
   * Valid sender number
   * @example 2345678901
   */
  to: string;
  /**
   * Text message
   * @example Hello from LockSpread
   */
  body: string;
}

class SMSService {
  async sendMessage(request: ISendSMSRequest): Promise<string> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_ID;

    if (!accountSid || !authToken || !messagingServiceSid) {
      throw Error('Invalid Twilio API Keys.');
    }

    const formattedNumber = `+1${request.to.toString().padStart(10, '0')}`;

    const result = await smsClient.messages.create({
      messagingServiceSid,
      to: formattedNumber,
      body: request.body,
    });

    if (result.status === 'failed') {
      throw new Error(
        `Failed to send sms message. Error Code: ${result.errorCode} / Error Message: ${result.errorMessage}`,
      );
    }

    console.log(`SMS sent to ${formattedNumber}. Message ID: ${result.sid}`);
    return result.sid;
  }
}

export const smsService = new SMSService();
