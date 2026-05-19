export const metadata = { title: 'Registration cancelled' };

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-4 text-5xl">↩️</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Payment cancelled</h1>
        <p className="text-gray-500">
          No charge was made. Your spot has not been held — head back to register when you're ready.
        </p>
        <a
          href="/register"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-pink-500 to-blue-500 px-8 py-3 font-semibold text-white hover:from-pink-600 hover:to-blue-600"
        >
          Back to registration
        </a>
      </div>
    </main>
  );
}
