import sendGridClient from '@sendgrid/client';
import { User } from '@prisma/client';

export const addSendGridContacts = async (users: User[]) => {
  const apiKey = process.env.SEND_GRID_API_KEY;
  if (!apiKey) {
    throw Error('Invalid SendGrid API Key.');
  }

  sendGridClient.setApiKey(apiKey);

  const data = {
    contacts: users.map((user) => ({
      first_name: user.firstname,
      last_name: user.lastname,
      email: user.email,
      address_line_1: user.address1,
      address_line_2: user.address2,
      city: user.city,
      state_province_region: user.state,
      postal_code: user.postalCode,
      country: 'US',
    })),
  };

  try {
    await sendGridClient.request({
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: data,
    });
    console.log('Successfully added SendGrid contacts.');
  } catch (e: any) {
    console.log(e.response?.body);
  }
};
