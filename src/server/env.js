// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const yup = require('yup');

/*eslint sort-keys: "error"*/
const envSchema = yup.object().shape({
  DATABASE_URL: yup.string().required(),
  LOGTAIL_SOURCE: yup.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: yup.string().required(),
  NEXT_PUBLIC_SUPABASE_URL: yup.string().required(),
  NODE_ENV: yup
    .string()
    .oneOf(['development', 'preview', 'production'])
    .required(),
  PORT: yup.number().default(3000),
  PRODUCTION_GIDX_ACTIVITY_ID: yup.string(),
  PRODUCTION_GIDX_API_KEY: yup.string(),
  PRODUCTION_GIDX_DEVICE_ID: yup.string(),
  PRODUCTION_GIDX_DIRECT_CASHIER_API_URL: yup.string(),
  PRODUCTION_GIDX_MERCHANT_ID: yup.string(),
  PRODUCTION_GIDX_PRODUCT_ID: yup.string(),
  SANDBOX_GIDX_ACTIVITY_ID: yup.string(),
  SANDBOX_GIDX_API_KEY: yup.string(),
  SANDBOX_GIDX_DEVICE_ID: yup.string(),
  SANDBOX_GIDX_DIRECT_CASHIER_API_URL: yup.string(),
  SANDBOX_GIDX_MERCHANT_ID: yup.string(),
  SANDBOX_GIDX_PRODUCT_ID: yup.string(),
  SEND_GRID_API_KEY: yup.string(),
  STATIC_IP_INBOUND_PROXY: yup.string(),
  STATIC_IP_OUTBOUND_PROXY: yup.string(),
  VERCEL_URL: yup.string(),
});

try {
  const env = envSchema.validateSync(process.env);
  module.exports.env = env;
} catch (error) {
  /** @type {yup.ValidationError} */
  // @ts-expect-error necessary typing
  const typedError = error;
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(typedError.errors, null, 4),
  );
  process.exit(1);
}
