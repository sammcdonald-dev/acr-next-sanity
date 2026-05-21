import 'server-only';

import * as v from 'valibot';
import { createEnv } from '@/utils/createEnv';

const envSchema = {
  SANITY_API_READ_TOKEN: v.pipe(v.string(), v.minLength(1)),
  SANITY_API_WRITE_TOKEN: v.pipe(v.string(), v.minLength(1)),
  STRIPE_SECRET_KEY: v.pipe(v.string(), v.minLength(1)),
  STRIPE_WEBHOOK_SECRET: v.optional(v.pipe(v.string(), v.minLength(1))),
  SANITY_WEBHOOK_SECRET: v.optional(v.pipe(v.string(), v.minLength(1))),
};
const serverEnv = createEnv(envSchema);
export { serverEnv };
