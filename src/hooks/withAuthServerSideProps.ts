import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { supabase } from '~/utils/supabaseClient';
import { UrlPaths } from '~/constants/UrlPaths';

export const withAuth = (gssp: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const user = await supabase.auth.api.getUserByCookie(
      context.req,
      context.res,
    );

    if (!user.user) {
      return {
        redirect: {
          permanent: false,
          destination: UrlPaths.Login,
        },
      };
    }

    return await gssp(context);
  };
};
