import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="flex justify-center items-center p-2 h-full w-full">
      <div className={'flex flex-col gap-8 max-w-screen-xl p-4'}>
        <div className={'flex flex-col gap-4'}>
          <h1 className={'text-2xl lg:text-3xl font-bold underline'}>
            Refund Policy
          </h1>
          <p>Payment/Deposits Refund Policy</p>
        </div>
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-lg lg:text-xl'}>
            Game Change Related Refunds:
          </p>
          <p>
            If a Contest related to a contest on our site is delayed or
            postponed, the contests will include statistics for that game only
            if it is played no later than Wednesday of that week. If a game is
            postponed to a later date or called off for any reason, the contest
            will get cancelled and fully refunded. As a participant, you can
            cancel your entry within 1 hour of creation and up to 15 minutes
            before the start of the first game of the contest. If both
            requirements are met, you will get a full refund. If game
            cancellations and/or postponements result in only one player left in
            a contest, then that contest will be cancelled, and users will be
            refunded the original contest entry/buy-in amount.
          </p>
        </div>
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-lg lg:text-xl'}>
            Compliance Related Refunds:
          </p>

          <p>
            In the event that the legality of a contest offered by LockSpread is
            altered by the state, district, region, or country (“locations”)
            occupied by the customer; Or, if LockSpread changes its contest
            availability policy for the location in which the customer resides,
            and the customer has previously entered a pay- entry contest that
            has not yet began then the customer may be refunded the original
            contest entry/buy-in amount.
          </p>
        </div>
        <div className={'flex flex-col gap-4'}>
          <p className={'font-semibold text-lg lg:text-xl'}>
            Requesting a refund:
          </p>

          <p>
            To request a refund of your deposit you must send an email to
            support@lockspread.com with the subject “Refund Request”. In the
            body of this email you must provide your full name, your username,
            the amount of the refund you are requesting, and the reason for your
            refund request. This process may take up to 14 business days for
            review. Please keep in mind that refunds are only granted under the
            following conditions: the refund was requested within 72 hours of
            account creation and the refund was requested within 24 hours of
            making your first deposit. If you request a refund, your account
            will automatically be closed. You cannot keep playing on LockSpread
            after requesting a refund. However, if you wish to start playing
            again at some point in the future, you can reopen your account,
            provided you reimburse LockSpread for the amount of your refund
            request.
          </p>
        </div>
        <div className={'flex flex-col gap-4'}>
          <span className={'font-semibold'}> Example:</span>
          <p>
            <span className={'font-semibold'}> Subject:</span> Refund Request
          </p>
          <p>
            <span className={'font-semibold'}> Name:</span> John Doe{' '}
          </p>
          <p>
            <span className={'font-semibold'}> Username:</span> johndoe88{' '}
          </p>
          <p>
            <span className={'font-semibold'}> Reason: </span> The contest that
            was entered was not valid for my location at the time of my entry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
