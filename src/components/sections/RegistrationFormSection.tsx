'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import type { RegistrationFormSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import RegistrationForm from '../forms/RegistrationForm';
import PortableText from '../modules/PortableText';

type Props = { section: RegistrationFormSectionFragmentType };

function FormWithSearchParams({ section }: Props) {
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('product') ?? undefined;
  const { heading, body, submitButtonLabel, products, uid } = section;

  return (
    <section id={uid ?? undefined} className="min-h-screen py-16">
      <div className="container mx-auto max-w-2xl px-4">
        {heading && (
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{heading}</h1>
        )}
        {body && (
          <div className="mb-10 text-gray-500">
            <PortableText value={body as PortableTextBlock[]} />
          </div>
        )}
        <RegistrationForm
          products={products ?? []}
          submitButtonLabel={submitButtonLabel ?? 'Continue to Payment'}
          preselectedProductId={preselectedProductId}
        />
      </div>
    </section>
  );
}

export default function RegistrationFormSection({ section }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-16 animate-pulse" />}>
      <FormWithSearchParams section={section} />
    </Suspense>
  );
}
