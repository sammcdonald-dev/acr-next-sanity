import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
}));

vi.mock('@/lib/sanity/client/live', () => ({
  sanityFetch: vi
    .fn()
    .mockResolvedValue({
      data: { title: 'Test Studio', email: 'owner@example.com' },
    }),
}));

vi.mock('@/env/serverEnv', () => ({
  serverEnv: { RESEND_API_KEY: undefined },
}));

const { contactAction } = await import('../contactAction');

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

describe('contactAction', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('rejects a missing name', async () => {
    const result = await contactAction(
      formData({ name: '', email: 'a@example.com', message: 'hello' })
    );
    expect(result.status).toBe('error');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    const result = await contactAction(
      formData({ name: 'A Parent', email: 'not-an-email', message: 'hello' })
    );
    expect(result.status).toBe('error');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('rejects an empty message', async () => {
    const result = await contactAction(
      formData({ name: 'A Parent', email: 'a@example.com', message: '' })
    );
    expect(result.status).toBe('error');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('fails gracefully when RESEND_API_KEY is not configured, without calling Resend', async () => {
    const result = await contactAction(
      formData({
        name: 'A Parent',
        email: 'a@example.com',
        message: 'Question about classes',
      })
    );
    expect(result.status).toBe('error');
    expect(result.error).toMatch(/not set up/i);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
