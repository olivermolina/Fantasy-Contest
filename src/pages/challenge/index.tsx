import CartContainer from '~/containers/CartContainer/CartContainer';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ContestPickerCategoryContainer from '~/containers/ContestPickerCategoryContainer/ContestPickerCategoryContainer';
import { Grid } from '@mui/material';
import React from 'react';
import requestIp from 'request-ip';
import ChallengeHeaderContainer from '~/containers/ChallengeHeaderContainer/ChallengeHeaderContainer';

interface Props {
  clientIp: string;
  query: GetServerSidePropsContext['query'];
}

const ChallengePage = (props: Props) => {
  return (
    <LayoutContainer query={props.query}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid
          item
          sx={{
            zIndex: 10,
            minWidth: '305px',
            display: { md: 'block', xs: 'none' },
          }}
          md={4}
          lg={3}
        >
          <CartContainer {...props} isChallengePage />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <ChallengeHeaderContainer />
          <ContestPickerContainer />
          <ContestPickerCategoryContainer />
          <MatchPickerTableContainer />
        </Grid>
      </Grid>
    </LayoutContainer>
  );
};

export default ChallengePage;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp, query: context.query },
    };
  },
);
