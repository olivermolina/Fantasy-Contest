import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { AppType } from 'next/dist/shared/lib/utils';
import { ReactElement, ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '~/state/store';
import { trpc } from '~/utils/trpc';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { DehydratedState } from '@tanstack/query-core/src/hydration';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const { dehydratedState, initialSession } = pageProps as {
    dehydratedState: { json: DehydratedState };
    initialSession: Session | null | undefined;
  };
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);
  const [queryClient] = useState(() => new QueryClient());
  return getLayout(
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState?.json}>
            <Component {...pageProps} />
          </Hydrate>
          <ToastContainer />
        </QueryClientProvider>
      </Provider>
    </SessionContextProvider>,
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
