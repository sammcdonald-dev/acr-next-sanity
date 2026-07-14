import { describe, expect, it } from 'vitest';
import { getTermCancelAtUnix } from '../subscriptionTerm';

describe('getTermCancelAtUnix', () => {
  it('converts a term end date to end-of-day UTC unix seconds', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(getTermCancelAtUnix('2026-05-15', now)).toBe(
      Math.floor(new Date('2026-05-15T23:59:59Z').getTime() / 1000)
    );
  });

  it('throws for a term end date in the past', () => {
    const now = new Date('2026-06-01T00:00:00Z');
    expect(() => getTermCancelAtUnix('2026-05-15', now)).toThrow(
      'Term end date must be in the future'
    );
  });

  it('throws for an invalid date string', () => {
    expect(() => getTermCancelAtUnix('not-a-date')).toThrow(
      'Invalid term end date'
    );
  });
});
