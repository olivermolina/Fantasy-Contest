import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import ContactUsContainer from '~/containers/ContactUsContainer';

const ContactUs = () => {
  return (
    <LandingLayout>
      <div className="flex justify-center items-center p-2">
        <ContactUsContainer />
      </div>
    </LandingLayout>
  );
};

export default ContactUs;
