import sgMail from '@sendgrid/mail';

interface SendEmailInputs {
  emailTo: string;
  emailFrom?: string;
  subject: string;
  body: string;
}

const sendEmail = async (sendEmailInputs: SendEmailInputs) => {
  const apiKey = process.env.SEND_GRID_API_KEY;
  if (!apiKey) throw Error('Unable to send email.');
  sgMail.setApiKey(apiKey);
  const { emailTo, emailFrom, subject, body } = sendEmailInputs;
  const msg = {
    to: emailTo,
    from: emailFrom || 'noreply@lockspread.com',
    subject,
    html: body,
  };
  try {
    await sgMail.send(msg);
    return { code: 'success', message: 'Email has been successfully sent.' };
  } catch (e: any) {
    return {
      code: 'failed',
      message: e.response?.body || 'Email failed to be sent.',
    };
  }
};

export default sendEmail;
