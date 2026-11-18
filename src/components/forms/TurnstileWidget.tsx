'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import type { Ref } from 'react';
import { clientEnv } from '@/env/clientEnv';

type Props = {
  action: 'registration' | 'contact';
  onToken?: (token: string | null) => void;
  ref?: Ref<TurnstileInstance>;
};

/**
 * Renders the Turnstile challenge. Inside a <form> it also adds a hidden
 * `cf-turnstile-response` input, which server actions can read from FormData.
 * Tokens are single-use: call `ref.current?.reset()` after each submission.
 */
export default function TurnstileWidget({ action, onToken, ref }: Props) {
  if (!clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return null;

  return (
    <Turnstile
      ref={ref}
      siteKey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      options={{ action }}
      onSuccess={(token) => onToken?.(token)}
      onExpire={() => onToken?.(null)}
      onError={() => onToken?.(null)}
    />
  );
}
