import Stripe from 'stripe';
import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';

const productQuery = /* groq */ `
  *[_type == "product" && _id == $productId][0]{
    _id,
    stripePriceId,
    stripeMode,
    maxSpots,
    "registrationCount": count(*[_type == "registration" && references(^._id) && status in ["pending", "confirmed"]])
  }
`;

type Student = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
};

type Parent = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export async function POST(req: Request) {
  const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);
  const readClient = client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN, useCdn: false });
  const writeClient = client.withConfig({ token: serverEnv.SANITY_API_WRITE_TOKEN, useCdn: false });

  const body = await req.json();
  const { productId, student, parent } = body as {
    productId: string;
    student: Student;
    parent: Parent;
  };

  if (!productId || !student || !parent) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const product = await readClient.fetch<{
    _id: string;
    stripePriceId: string;
    stripeMode: 'payment' | 'subscription';
    maxSpots: number | null;
    registrationCount: number;
  } | null>(productQuery, { productId });

  if (!product?.stripePriceId) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  if (product.maxSpots != null && product.registrationCount >= product.maxSpots) {
    return Response.json({ error: 'This program is full' }, { status: 409 });
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
    metadata: { registrationId: registration._id },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
  });

  await writeClient
    .patch(registration._id)
    .set({ stripeSessionId: session.id })
    .commit();

  return Response.json({ url: session.url });
}
