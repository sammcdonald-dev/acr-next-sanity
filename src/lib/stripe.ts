import 'server-only'

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

if (!key && !process.env.SKIP_ENV_VALIDATION) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(key ?? '')
