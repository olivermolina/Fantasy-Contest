// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { env } = require('./src/server/env');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  mode: 'production',
  disable: process.env.NODE_ENV === 'development',
  disableDevLogs: true,
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import("next").NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import("next").NextConfig}}
 */
function getConfig(config) {
  return config;
}

const nextConfig = withPWA(
  getConfig({
    /**
     * Dynamic configuration available for the browser and server.
     * Note: requires `ssr: true` or a `getInitialProps` in `_app.tsx`
     * @link https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
     */
    publicRuntimeConfig: {
      NODE_ENV: env.NODE_ENV,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.(js|ts)x?$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
    reactStrictMode: true,
  }),
);

/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = withBundleAnalyzer(nextConfig);
