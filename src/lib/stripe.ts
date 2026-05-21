import 'server-only'

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

if (!key && !process.env.SKIP_ENV_VALIDATION) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

// During build (SKIP_ENV_VALIDATION=1) key is undefined — skip instantiation.
// Routes are only imported for analysis at build time, never executed.
export const stripe = key ? new Stripe(key) : (null as unknown as Stripe)
