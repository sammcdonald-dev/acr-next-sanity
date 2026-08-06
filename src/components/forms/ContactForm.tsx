'use client';

import { useActionState, useRef } from 'react';
import { contactAction } from '@/actions/contactAction';
import type { ActionResponse } from '@/actions/types';
import { Button } from '@/components/ui/Button';

export default function ContactForm({
  submitButtonLabel,
}: {
  submitButtonLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<
    Partial<ActionResponse>,
    FormData
  >(async (_state, formData) => {
    const result = await contactAction(formData);
    if (result.status === 'success') {
      formRef.current?.reset();
    }
    return result;
  }, {});

  return (
    <form ref={formRef} action={formAction} className="space-y-5 max-w-xl">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-navy/80"
        >
          Name <span className="text-coral">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-navy/80"
        >
          Email <span className="text-coral">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-navy/80"
        >
          Message <span className="text-coral">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky"
        />
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? 'Sending…' : submitButtonLabel}
      </Button>

      {!pending && state.status === 'success' && (
        <p className="rounded-lg border border-sky/30 bg-sky/10 px-4 py-3 text-sm text-navy">
          Thanks for reaching out! We'll get back to you soon.
        </p>
      )}
      {!pending && state.status === 'error' && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
