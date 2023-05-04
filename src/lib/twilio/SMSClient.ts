import { Twilio } from 'twilio';

const smsClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export { smsClient };
