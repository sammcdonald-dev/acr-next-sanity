import AccountPortalForm from '@/components/forms/AccountPortalForm';

export const metadata = { title: 'Customer Portal' };

export default function AccountPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-coral mb-2">
          Customer Portal
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy mb-4">
          Manage Your Account
        </h1>
        <p className="text-lg text-navy/70 mb-10">
          Enter the email you used when registering to view invoices, update your payment
          method, or cancel a subscription — securely, via Stripe.
        </p>

        <AccountPortalForm />
      </div>
    </section>
  );
}
