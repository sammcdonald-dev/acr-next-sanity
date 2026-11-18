import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockEnv: { TURNSTILE_SECRET_KEY?: string } = {
  TURNSTILE_SECRET_KEY: 'secret',
};

vi.mock('@/env/serverEnv', () => ({ serverEnv: mockEnv }));
vi.mock('@/env/clientEnv', () => ({
  clientEnv: { NEXT_PUBLIC_SITE_URL: 'https://actorscraftroom.com' },
}));

const { verifyTurnstile } = await import('../turnstile');

const fetchMock = vi.fn();

function siteverify(body: object, ok = true) {
  fetchMock.mockResolvedValue({ ok, json: async () => body });
}

describe('verifyTurnstile', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockEnv.TURNSTILE_SECRET_KEY = 'secret';
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('fails closed without a token or secret', async () => {
    expect(await verifyTurnstile({ token: '', action: 'contact' })).toBe(false);
    expect(await verifyTurnstile({ token: undefined, action: 'contact' })).toBe(
      false
    );
    mockEnv.TURNSTILE_SECRET_KEY = undefined;
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts a successful verification', async () => {
    siteverify({ success: true });
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      true
    );
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get('secret')).toBe('secret');
    expect(body.get('response')).toBe('tok');
  });

  it('rejects when Cloudflare says the token is invalid', async () => {
    siteverify({ success: false, 'error-codes': ['invalid-input-response'] });
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );
  });

  it('fails closed on network errors and non-OK responses', async () => {
    fetchMock.mockRejectedValue(new Error('network'));
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );
    siteverify({ success: true }, false);
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );
  });

  it('checks action and hostname in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    siteverify({
      success: true,
      action: 'contact',
      hostname: 'actorscraftroom.com',
    });
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      true
    );

    siteverify({
      success: true,
      action: 'registration',
      hostname: 'actorscraftroom.com',
    });
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );

    siteverify({ success: true, action: 'contact', hostname: 'evil.test' });
    expect(await verifyTurnstile({ token: 'tok', action: 'contact' })).toBe(
      false
    );
  });
});
