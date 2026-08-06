export const metadata = { title: 'Registration cancelled' };

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4 text-center">
      <div className="max-w-md rounded-3xl bg-white p-10 shadow-sm">
        <div className="mb-4 text-5xl">↩️</div>
        <h1 className="font-display mb-2 text-2xl font-semibold text-navy">
          Payment cancelled
        </h1>
        <p className="text-navy/70">
          No charge was made. Your spot has not been held — head back to
          register when you're ready.
        </p>
        <a
          href="/register"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-coral to-gold px-8 py-3 font-bold text-navy hover:from-coral-dark hover:to-gold-dark transition"
        >
          Back to registration
        </a>
      </div>
    </main>
  );
}
