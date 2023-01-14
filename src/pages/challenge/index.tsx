import CartContainer from '~/containers/CartContainer/CartContainer';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ContestPickerCategoryContainer from '~/containers/ContestPickerCategoryContainer/ContestPickerCategoryContainer';
import { Grid } from '@mui/material';
import React from 'react';
import requestIp from 'request-ip';

interface Props {
  clientIp: string;
}

const ChallengePage = (props: Props) => {
  return (
    <LayoutContainer>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
        sx={(theme) => ({
          [theme.breakpoints.down('md')]: {
            p: 4,
          },
        })}
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
          <CartContainer {...props} />
        </Grid>
        <Grid
          item
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              p: 4,
              zIndex: 1,
            },
          })}
          xs={12}
          md={8}
          lg={9}
        >
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
      props: { clientIp },
    };
  },
);
