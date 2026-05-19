import 'server-only';

import * as v from 'valibot';
import { createEnv } from '@/utils/createEnv';

const envSchema = {
  SANITY_API_READ_TOKEN: v.pipe(v.string(), v.minLength(1)),
  SANITY_API_WRITE_TOKEN: v.pipe(v.string(), v.minLength(1)),
  STRIPE_SECRET_KEY: v.pipe(v.string(), v.minLength(1)),
  STRIPE_WEBHOOK_SECRET: v.optional(v.pipe(v.string(), v.minLength(1))),
  MAX_STATIC_PARAMS: v.pipe(
    v.string(),
    v.transform(parseInt),
    v.number(),
    v.minValue(1),
    v.maxValue(1000),
  ),
};
const serverEnv = createEnv(envSchema);
export { serverEnv };
