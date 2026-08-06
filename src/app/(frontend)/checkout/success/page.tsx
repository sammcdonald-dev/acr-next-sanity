export const metadata = { title: 'Registration confirmed' };

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4 text-center">
      <div className="max-w-md rounded-3xl bg-white p-10 shadow-sm">
        <div className="mb-4 text-5xl">🎉</div>
        <h1 className="font-display mb-2 text-2xl font-semibold text-navy">
          You're registered!
        </h1>
        <p className="text-navy/70">
          Your spot is confirmed. Check your email for a receipt and further
          details.
        </p>
        <a
          href="/"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-coral to-gold px-8 py-3 font-bold text-navy hover:from-coral-dark hover:to-gold-dark transition"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
