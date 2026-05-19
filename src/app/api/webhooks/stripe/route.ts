import type Stripe from 'stripe';
import StripeSDK from 'stripe';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';

const stripe = new StripeSDK(serverEnv.STRIPE_SECRET_KEY);

const writeClient = client.withConfig({
  token: serverEnv.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, serverEnv.STRIPE_WEBHOOK_SECRET);
  } catch {
    return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const registrationId = session.metadata?.registrationId;

  if (!registrationId) {
    return Response.json({ received: true });
  }

  if (event.type === 'checkout.session.completed') {
    await writeClient
      .patch(registrationId)
      .set({ status: 'confirmed' })
      .commit();
  }

  if (event.type === 'checkout.session.expired') {
    await writeClient
      .patch(registrationId)
      .set({ status: 'cancelled' })
      .commit();
  }

  return Response.json({ received: true });
}
