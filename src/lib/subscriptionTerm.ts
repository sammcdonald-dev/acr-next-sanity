/**
 * Converts a term end date (YYYY-MM-DD) into the Unix timestamp Stripe should
 * use for `subscription_data.cancel_at`, so the subscription's final billing
 * cycle still falls within the term before it auto-cancels.
 */
export function getTermCancelAtUnix(
  termEndDate: string,
  now: Date = new Date()
): number {
  const cancelAt = new Date(`${termEndDate}T23:59:59Z`);

  if (Number.isNaN(cancelAt.getTime())) {
    throw new Error(`Invalid term end date: ${termEndDate}`);
  }

  if (cancelAt.getTime() <= now.getTime()) {
    throw new Error(`Term end date must be in the future: ${termEndDate}`);
  }

  return Math.floor(cancelAt.getTime() / 1000);
}
