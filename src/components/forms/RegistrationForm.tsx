'use client';

import { type FormEvent, useState } from 'react';

type Product = {
  _id: string;
  name: string | null;
  description: string | null;
  stripeMode: 'payment' | 'subscription' | null;
  spotsRemaining: number | null;
  termEndDate: string | null;
};

function formatTermEndDate(termEndDate: string): string {
  return new Date(`${termEndDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

type Props = {
  products: Product[];
  submitButtonLabel?: string;
  preselectedProductId?: string;
};

type FormState = {
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: string;
  studentAge: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  productId: string;
};

export default function RegistrationForm({
  products,
  submitButtonLabel = 'Continue to Payment',
  preselectedProductId,
}: Props) {
  const [form, setForm] = useState<FormState>({
    studentFirstName: '',
    studentLastName: '',
    studentEmail: '',
    studentPhone: '',
    studentAge: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    productId: preselectedProductId ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: form.productId,
          student: {
            firstName: form.studentFirstName,
            lastName: form.studentLastName,
            email: form.studentEmail,
            phone: form.studentPhone,
            age: Number(form.studentAge),
          },
          parent: {
            firstName: form.parentFirstName,
            lastName: form.parentLastName,
            email: form.parentEmail,
            phone: form.parentPhone,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Program selection */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Program</h2>
        <div>
          <label
            htmlFor="productId"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Select a program <span className="text-red-500">*</span>
          </label>
          <select
            id="productId"
            value={form.productId}
            onChange={set('productId')}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">— Choose a program —</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name ?? 'Unnamed program'}
                {p.spotsRemaining !== null
                  ? ` (${p.spotsRemaining} spot${p.spotsRemaining === 1 ? '' : 's'} left)`
                  : ''}
                {p.stripeMode === 'subscription' && p.termEndDate
                  ? ` — monthly through ${formatTermEndDate(p.termEndDate)}`
                  : ''}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Student / camper info */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Student / Camper
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            id="studentFirstName"
            value={form.studentFirstName}
            onChange={set('studentFirstName')}
            required
          />
          <Field
            label="Last name"
            id="studentLastName"
            value={form.studentLastName}
            onChange={set('studentLastName')}
            required
          />
          <Field
            label="Email"
            id="studentEmail"
            type="email"
            value={form.studentEmail}
            onChange={set('studentEmail')}
            required
          />
          <Field
            label="Phone"
            id="studentPhone"
            type="tel"
            value={form.studentPhone}
            onChange={set('studentPhone')}
            required
          />
          <Field
            label="Age"
            id="studentAge"
            type="number"
            min="1"
            max="100"
            value={form.studentAge}
            onChange={set('studentAge')}
            required
          />
        </div>
      </section>

      {/* Parent / guardian info */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Parent / Guardian
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            id="parentFirstName"
            value={form.parentFirstName}
            onChange={set('parentFirstName')}
            required
          />
          <Field
            label="Last name"
            id="parentLastName"
            value={form.parentLastName}
            onChange={set('parentLastName')}
            required
          />
          <Field
            label="Email"
            id="parentEmail"
            type="email"
            value={form.parentEmail}
            onChange={set('parentEmail')}
            required
          />
          <Field
            label="Phone"
            id="parentPhone"
            type="tel"
            value={form.parentPhone}
            onChange={set('parentPhone')}
            required
          />
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-blue-500 py-3 font-semibold text-white shadow-sm transition hover:from-pink-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Redirecting to checkout…' : submitButtonLabel}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
};

function Field({
  label,
  id,
  value,
  onChange,
  type = 'text',
  required,
  min,
  max,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
