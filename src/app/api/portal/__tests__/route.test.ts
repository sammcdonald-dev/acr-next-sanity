import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
const mockSessionsCreate = vi.fn();

vi.mock('@/lib/sanity/client/client', () => ({
  client: {
    withConfig: () => ({ fetch: mockFetch }),
  },
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    billingPortal: { sessions: { create: mockSessionsCreate } },
  }),
}));

vi.mock('@/env/serverEnv', () => ({
  serverEnv: { SANITY_API_READ_TOKEN: 'test-token' },
}));

vi.mock('@/env/clientEnv', () => ({
  clientEnv: { NEXT_PUBLIC_SITE_URL: 'https://example.test' },
}));

const { POST } = await import('../route');

function postRequest(body: unknown) {
  return new Request('http://localhost/api/portal', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/portal', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockSessionsCreate.mockReset();
  });

  it('rejects requests with no email', async () => {
    const res = await POST(postRequest({}));
    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 404 when no registration matches the email', async () => {
    mockFetch.mockResolvedValue([
      {
        stripeCustomerId: 'cus_1',
        parentEmail: 'other@example.com',
        studentEmail: null,
      },
    ]);

    const res = await POST(postRequest({ email: 'nobody@example.com' }));

    expect(res.status).toBe(404);
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('matches case-insensitively on parent or student email and creates a billing portal session', async () => {
    mockFetch.mockResolvedValue([
      {
        stripeCustomerId: 'cus_42',
        parentEmail: 'Parent@Example.com',
        studentEmail: null,
      },
    ]);
    mockSessionsCreate.mockResolvedValue({
      url: 'https://billing.stripe.com/session/abc',
    });

    const res = await POST(postRequest({ email: 'parent@example.com' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(mockSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_42',
        return_url: 'https://example.test/account',
      })
    );
    expect(data.url).toBe('https://billing.stripe.com/session/abc');
  });

  it('returns a friendly error instead of crashing when Stripe rejects the request', async () => {
    mockFetch.mockResolvedValue([
      {
        stripeCustomerId: 'cus_stale',
        parentEmail: 'parent@example.com',
        studentEmail: null,
      },
    ]);
    mockSessionsCreate.mockRejectedValue(
      new Error("No such customer: 'cus_stale'")
    );

    const res = await POST(postRequest({ email: 'parent@example.com' }));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toMatch(/couldn't open your account portal/i);
  });

  it('matches on studentEmail when parentEmail differs', async () => {
    mockFetch.mockResolvedValue([
      {
        stripeCustomerId: 'cus_99',
        parentEmail: 'mom@example.com',
        studentEmail: 'kid@example.com',
      },
    ]);
    mockSessionsCreate.mockResolvedValue({
      url: 'https://billing.stripe.com/session/xyz',
    });

    const res = await POST(postRequest({ email: 'kid@example.com' }));

    expect(res.status).toBe(200);
    expect(mockSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: 'cus_99' })
    );
  });
});
