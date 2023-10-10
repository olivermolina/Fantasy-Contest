import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import ContactUsContainer from '~/containers/ContactUsContainer';
import { Header } from '~/components';

const ContactUs = () => {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta
            name="description"
            content={`We‘ll get back to you as soon as we can!`}
          />
        </Header>
      }
    >
      <div className="flex justify-center items-center p-2">
        <ContactUsContainer />
      </div>
    </LandingLayout>
  );
};

export default ContactUs;
