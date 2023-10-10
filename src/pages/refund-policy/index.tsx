import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import { Header } from '~/components';
import RefundPolicy from '~/components/RefundPolicy/RefundPolicy';

const IndexPage = () => {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta
            name="description"
            content={`Game Change Related Refunds. If a Contest related to a contest on our site is delayed or postponed, the contests will include statistics for that game only if it is played no later than Wednesday of that week. If a game is postponed to a later date or called off for any reason, the contest will get cancelled and fully refunded. As a participant, you can cancel your entry within 1 hour of creation and up to 15 minutes before the start of the first game of the contest. If both requirements are met, you will get a full refund. If game cancellations and/or postponements result in only one player left in a contest, then that contest will be cancelled, and users will be refunded the original contest entry/buy-in amount`}
          />
        </Header>
      }
    >
      <RefundPolicy />
    </LandingLayout>
  );
};

export default IndexPage;
