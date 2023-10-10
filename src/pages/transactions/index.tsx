import React from 'react';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ProfileTransactionHistoryContainer from '~/containers/ProfileTransactionHistoryContainer';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';

const localeObject = {
  ...en,
  weekStart: 1,
  formats: {
    // abbreviated format options allowing localization
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A',
    // lowercase/short, optional formats for localization
    l: 'D/M/YYYY',
    ll: 'D MMM, YYYY',
    lll: 'D MMM, YYYY h:mm A',
    llll: 'ddd, MMM D, YYYY h:mm A',
  },
};
dayjs.extend(utc);
dayjs.locale(localeObject);

const TransactionsPage = () => {
  const router = useRouter();

  return (
    <LayoutContainer>
      <div className="grid h-full w-full p-2">
        <ProfileTransactionHistoryContainer
          userId={router.query.userId as string}
        />
      </div>
    </LayoutContainer>
  );
};

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
