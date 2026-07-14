import type Stripe from 'stripe';
import StripeSDK from 'stripe';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';

type SanityClient = ReturnType<typeof client.withConfig>;

function toId(
  value: string | { id: string } | null | undefined
): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.id;
}

async function handleCheckoutSessionEvent(
  event: Stripe.Event,
  writeClient: SanityClient
) {
  const session = event.data.object as Stripe.Checkout.Session;
  const registrationId = session.metadata?.registrationId;

  if (!registrationId) return;

  if (event.type === 'checkout.session.completed') {
    await writeClient
      .patch(registrationId)
      .set(
        session.mode === 'subscription'
          ? {
              status: 'confirmed',
              stripeCustomerId: toId(session.customer),
              stripeSubscriptionId: toId(session.subscription),
              subscriptionStatus: 'active',
            }
          : { status: 'confirmed' }
      )
      .commit();
  }

  if (event.type === 'checkout.session.expired') {
    await writeClient
      .patch(registrationId)
      .set({ status: 'cancelled' })
      .commit();
  }
}

function getSubscriptionId(event: Stripe.Event): string | undefined {
  if (event.type === 'customer.subscription.deleted') {
    return (event.data.object as Stripe.Subscription).id;
  }
  return toId(
    (event.data.object as Stripe.Invoice).parent?.subscription_details
      ?.subscription
  );
}

async function handleSubscriptionLifecycleEvent(
  event: Stripe.Event,
  readClient: SanityClient,
  writeClient: SanityClient
) {
  const subscriptionId = getSubscriptionId(event);
  if (!subscriptionId) return;

  const registrationId = await readClient.fetch<string | null>(
    /* groq */ `*[_type == "registration" && stripeSubscriptionId == $subscriptionId][0]._id`,
    { subscriptionId }
  );
  if (!registrationId) return;

  if (event.type === 'customer.subscription.deleted') {
    await writeClient
      .patch(registrationId)
      .set({ status: 'cancelled', subscriptionStatus: 'canceled' })
      .commit();
  }

  if (event.type === 'invoice.payment_failed') {
    await writeClient
      .patch(registrationId)
      .set({ subscriptionStatus: 'past_due' })
      .commit();
  }

  if (event.type === 'invoice.paid') {
    await writeClient
      .patch(registrationId)
      .set({ subscriptionStatus: 'active' })
      .commit();
  }
}

export async function POST(req: Request) {
  const stripe = new StripeSDK(serverEnv.STRIPE_SECRET_KEY);
  const readClient = client.withConfig({
    token: serverEnv.SANITY_API_READ_TOKEN,
    useCdn: false,
  });
  const writeClient = client.withConfig({
    token: serverEnv.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return Response.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!serverEnv.STRIPE_WEBHOOK_SECRET) {
    return Response.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return Response.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.expired'
  ) {
    await handleCheckoutSessionEvent(event, writeClient);
  }

  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'invoice.payment_failed' ||
    event.type === 'invoice.paid'
  ) {
    await handleSubscriptionLifecycleEvent(event, readClient, writeClient);
  }

  return Response.json({ received: true });
}
