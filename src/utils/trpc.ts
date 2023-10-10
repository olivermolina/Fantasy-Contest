import { createTRPCNext } from '@trpc/next';
import { NextPageContext } from 'next';
import superjson from 'superjson';
import type { AppRouter } from '~/server/routers/_app';

import {
  httpBatchLink,
  httpLink,
  loggerLink,
  splitLink,
  TRPCLink,
} from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { DefaultOptions } from '@tanstack/react-query';
import { observable } from '@trpc/server/observable';

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @example
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   */
  status?: number;
}

/**
 *  Custom link to handle authentication
 */
export const customLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      return next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          observer.error(err);
          if (err?.data?.code === 'UNAUTHORIZED') {
            const win: Window = window;
            win.location = '/auth/login';
          }
        },
        complete() {
          observer.complete();
        },
      });
    });
  };
};

/**
 * Links to be used in both client and server
 */
export const trpcLinks = () => [
  customLink,
  loggerLink({
    enabled: (opts) =>
      process.env.NODE_ENV === 'development' ||
      (opts.direction === 'down' && opts.result instanceof Error),
  }),
  splitLink({
    condition(op) {
      // check for context property `skipBatch`
      return op.context.skipBatch === true;
    },
    // when condition is true, use normal request
    true: httpLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
    // when condition is false, use batching
    false: httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  }),
];

export const trpcTransformer = superjson;

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpcConfig: Parameters<
  typeof createTRPCNext<AppRouter, SSRContext>
>[0] = {
  config({ ctx }) {
    const commonOpts = {
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: trpcTransformer,
      /**
       * @link https://trpc.io/docs/links
       */
      links: trpcLinks(),
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: false,
            retryOnMount: false,
            enabled: false,
            refetchInterval: 30 * 1000,
          },
        } as DefaultOptions,
      },
    };

    if (typeof window !== 'undefined') {
      // during client requests
      return {
        ...commonOpts,
        url: '/api/trpc',
      };
    }
    // during SSR below
    // optional: use SSG-caching for each rendered page (see caching section for more details)
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      'Cache-Control',
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
    );
    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/trpc`
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      ...commonOpts,
      url,
      /**
       * Set custom request headers on every request from tRPC
       * @link http://localhost:3000/docs/v10/header
       * @link http://localhost:3000/docs/v10/ssr
       */
      headers() {
        if (ctx?.req) {
          // To use SSR properly, you need to forward the client's headers to the server
          // This is so you can pass through things like cookies when we're server-side rendering
          // If you're using Node 18, omit the "connection" header
          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            connection: _connection,
            ...headers
          } = ctx.req.headers;
          return {
            ...headers,
            // Optional: inform server that it's an SSR request
            'x-ssr': '1',
          };
        } else {
          const { ...headers } = ctx?.req?.headers;
          return {
            ...headers,
          };
        }
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
  // /**
  //  * Set headers or status code when doing SSR
  //  */
  // responseMeta({ ctx, clientErrors }) {
  //   if (clientErrors && clientErrors.length) {
  //     // propagate http first error from API calls
  //     return {
  //       status: clientErrors[0]!.data?.httpStatus ?? 500,
  //     };
  //   }
  //   // cache request for 1 day + revalidate once every second
  //   const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  //   return {
  //     headers: {
  //       'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  //     },
  //   };
  // },
};

export const trpc = createTRPCNext<AppRouter, SSRContext>(trpcConfig);

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferQueryInput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>;

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations'],
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations'],
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;
