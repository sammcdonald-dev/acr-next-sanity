import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
const mockCreate = vi.fn();
const mockVerify = vi.fn();

vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: { sessions: { create: vi.fn() } },
  })),
}));

vi.mock('@/lib/sanity/client/client', () => ({
  client: {
    withConfig: () => ({
      fetch: mockFetch,
      create: mockCreate,
      patch: vi.fn(),
    }),
  },
}));

vi.mock('@/lib/turnstile', () => ({ verifyTurnstile: mockVerify }));

vi.mock('@/env/serverEnv', () => ({
  serverEnv: {
    STRIPE_SECRET_KEY: 'sk_test',
    SANITY_API_READ_TOKEN: 'r',
    SANITY_API_WRITE_TOKEN: 'w',
  },
}));

vi.mock('@/env/clientEnv', () => ({
  clientEnv: { NEXT_PUBLIC_SITE_URL: 'https://example.test' },
}));

const { POST } = await import('../route');

const validBody = {
  productId: 'prod_1',
  turnstileToken: 'tok',
  student: {
    firstName: 'Sam',
    lastName: 'Student',
    email: 'sam@example.com',
    phone: '555-1234',
    age: 12,
  },
  parent: {
    firstName: 'Pat',
    lastName: 'Parent',
    email: 'pat@example.com',
    phone: '555-5678',
  },
};

function postRequest(body: unknown) {
  return new Request('http://localhost/api/register', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/register', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCreate.mockReset();
    mockVerify.mockReset();
  });

  it('rejects a failed bot check before touching Sanity', async () => {
    mockVerify.mockResolvedValue(false);

    const res = await POST(postRequest(validBody));

    expect(res.status).toBe(403);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const res = await POST(postRequest('not json'));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('rejects an invalid payload even with a valid token', async () => {
    mockVerify.mockResolvedValue(true);

    const res = await POST(
      postRequest({
        ...validBody,
        parent: { ...validBody.parent, email: 'not-an-email' },
      })
    );

    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('passes the token and action to verification', async () => {
    mockVerify.mockResolvedValue(true);
    mockFetch.mockResolvedValue(null); // product not found -> 404

    const res = await POST(postRequest(validBody));

    expect(mockVerify).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'tok', action: 'registration' })
    );
    expect(res.status).toBe(404);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
