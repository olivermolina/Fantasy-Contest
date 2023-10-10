import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import { Header } from '~/components';
import ResponsibleGaming from '~/components/ResponsibleGaming/ResponsibleGaming';

const IndexPage = () => {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta
            name="description"
            content={`The following provides information regarding the measures LLSS Enterprises, Inc. d/b/a LockSpread (“LockSpread,” “we,” “us,” or “our”) has put in place in order to ensure a fair, safe, and responsible gaming environment regarding your use of the [https://www.lockspread.com/] website and the LockSpread mobile application (together, or individually, the “Service“).`}
          />
        </Header>
      }
    >
      <ResponsibleGaming />
    </LandingLayout>
  );
};

export default IndexPage;
