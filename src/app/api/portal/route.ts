import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { getStripe } from '@/lib/stripe';

const registrationsWithStripeCustomerQuery = /* groq */ `
  *[_type == "registration" && defined(stripeCustomerId)] | order(submittedAt desc) {
    stripeCustomerId,
    parentEmail,
    studentEmail
  }
`;

export async function POST(req: Request) {
  const body = await req.json();
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  const readClient = client.withConfig({
    token: serverEnv.SANITY_API_READ_TOKEN,
    useCdn: false,
  });

  const registrations = await readClient.fetch<
    {
      stripeCustomerId: string;
      parentEmail: string | null;
      studentEmail: string | null;
    }[]
  >(registrationsWithStripeCustomerQuery);

  const match = registrations.find(
    (r) =>
      r.parentEmail?.toLowerCase() === email ||
      r.studentEmail?.toLowerCase() === email
  );

  if (!match) {
    return Response.json(
      {
        error:
          "We couldn't find an account with that email. Double-check the email you registered with, or contact us for help.",
      },
      { status: 404 }
    );
  }

  const stripe = getStripe();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: match.stripeCustomerId,
      return_url: `${clientEnv.NEXT_PUBLIC_SITE_URL}/account`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Failed to create Stripe billing portal session', error);
    return Response.json(
      {
        error:
          "We couldn't open your account portal right now. Please contact us for help.",
      },
      { status: 502 }
    );
  }
}
