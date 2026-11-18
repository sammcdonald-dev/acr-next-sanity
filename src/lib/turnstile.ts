import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type TurnstileAction = 'registration' | 'contact';

type SiteverifyResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
};

/**
 * Verifies a Turnstile token server-side. Fails closed: a missing secret,
 * missing token, network error or any failed check returns false.
 */
export async function verifyTurnstile({
  token,
  action,
  ip,
}: {
  token: unknown;
  action: TurnstileAction;
  ip?: string | null;
}): Promise<boolean> {
  const secret = serverEnv.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== 'string' || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;

    const result = (await res.json()) as SiteverifyResponse;
    if (!result.success) return false;

    // Cloudflare's dummy test keys don't echo a real action/hostname, so the
    // surface and hostname checks only apply in production.
    if (process.env.NODE_ENV === 'production') {
      if (result.action !== action) return false;
      const expectedHost = new URL(clientEnv.NEXT_PUBLIC_SITE_URL).hostname;
      if (result.hostname !== expectedHost) return false;
    }

    return true;
  } catch {
    return false;
  }
}
