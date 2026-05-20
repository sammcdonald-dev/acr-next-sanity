import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { serverEnv } from '@/env/serverEnv';

export async function POST(req: NextRequest) {
  const secret = serverEnv.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const { body, isValidSignature } = await parseBody<{ _type?: string }>(
    req,
    secret
  );

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json(
      { message: 'Bad request: missing _type' },
      { status: 400 }
    );
  }

  revalidateTag(body._type);

  return NextResponse.json({ revalidated: true, type: body._type });
}
