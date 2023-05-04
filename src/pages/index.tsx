import React from 'react';
import LandingLayoutContainer from '~/containers/LandingLayoutContainer';
import { GetServerSideProps } from 'next';
import { supabase } from '~/utils/supabaseClient';

interface Props {
  isLoggedIn: boolean;
}
const Home = (props: Props) => {
  return <LandingLayoutContainer isLoggedIn={props.isLoggedIn} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);

  return {
    props: { isLoggedIn: !!user.user },
  };
};
export default Home;
