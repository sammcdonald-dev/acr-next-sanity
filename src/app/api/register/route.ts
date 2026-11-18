import Stripe from 'stripe';
import * as v from 'valibot';
import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { getTermCancelAtUnix } from '@/lib/subscriptionTerm';
import { verifyTurnstile } from '@/lib/turnstile';

const productQuery = /* groq */ `
  *[_type == "product" && _id == $productId][0]{
    _id,
    stripePriceId,
    stripeMode,
    maxSpots,
    termEndDate,
    "registrationCount": count(*[_type == "registration" && references(^._id) && status in ["pending", "confirmed"]])
  }
`;

const name = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100));
const email = v.pipe(v.string(), v.trim(), v.email(), v.maxLength(254));
const phone = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(30));

const RegistrationSchema = v.object({
  productId: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  student: v.object({
    firstName: name,
    lastName: name,
    email,
    phone,
    age: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  }),
  parent: v.object({ firstName: name, lastName: name, email, phone }),
});

export async function POST(req: Request) {
  const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);
  const readClient = client.withConfig({
    token: serverEnv.SANITY_API_READ_TOKEN,
    useCdn: false,
  });
  const writeClient = client.withConfig({
    token: serverEnv.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Verify the bot check before touching Sanity or Stripe.
  const humanVerified = await verifyTurnstile({
    token: (body as { turnstileToken?: unknown } | null)?.turnstileToken,
    action: 'registration',
    ip: req.headers.get('cf-connecting-ip'),
  });
  if (!humanVerified) {
    return Response.json(
      { error: 'Bot check failed. Please refresh the page and try again.' },
      { status: 403 }
    );
  }

  const parsed = v.safeParse(RegistrationSchema, body);
  if (!parsed.success) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { productId, student, parent } = parsed.output;

  const product = await readClient.fetch<{
    _id: string;
    stripePriceId: string;
    stripeMode: 'payment' | 'subscription';
    maxSpots: number | null;
    termEndDate: string | null;
    registrationCount: number;
  } | null>(productQuery, { productId });

  if (!product?.stripePriceId) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  if (
    product.maxSpots != null &&
    product.registrationCount >= product.maxSpots
  ) {
    return Response.json({ error: 'This program is full' }, { status: 409 });
  }

  let termCancelAtUnix: number | undefined;
  if (product.stripeMode === 'subscription' && product.termEndDate) {
    try {
      termCancelAtUnix = getTermCancelAtUnix(product.termEndDate);
    } catch {
      return Response.json(
        { error: 'Registration for this term has closed' },
        { status: 400 }
      );
    }
  }

  const registration = await writeClient.create({
    _type: 'registration',
    studentFirstName: student.firstName,
    studentLastName: student.lastName,
    studentEmail: student.email,
    studentPhone: student.phone,
    studentAge: student.age,
    parentFirstName: parent.firstName,
    parentLastName: parent.lastName,
    parentEmail: parent.email,
    parentPhone: parent.phone,
    product: { _type: 'reference', _ref: productId },
    status: 'pending',
    submittedAt: new Date().toISOString(),
  });

  const baseUrl = clientEnv.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: product.stripeMode ?? 'payment',
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    customer_email: parent.email,
    // Session expires after 1 hour so pending spots free up promptly
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    // termCancelAtUnix can't be set via subscription_data at Checkout Session
    // creation (Stripe rejects `subscription_data[cancel_at]`); it's stashed
    // here so the webhook can apply it with subscriptions.update() once the
    // subscription actually exists.
    metadata: {
      registrationId: registration._id,
      ...(termCancelAtUnix && { termCancelAtUnix: String(termCancelAtUnix) }),
    },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
    ...(product.stripeMode === 'subscription' && {
      subscription_data: {
        metadata: { registrationId: registration._id },
      },
    }),
  });

  await writeClient
    .patch(registration._id)
    .set({ stripeSessionId: session.id })
    .commit();

  return Response.json({ url: session.url });
}
