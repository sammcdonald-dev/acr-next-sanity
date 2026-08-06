'use client';

import { useSearchParams } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { Suspense } from 'react';
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
      <div className="container mx-auto max-w-2xl px-4 pt-4">
        {heading && (
          <h1 className="font-display mb-2 text-3xl md:text-4xl font-semibold text-navy">
            {heading}
          </h1>
        )}
        {body && (
          <div className="mb-10 text-navy/70">
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
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 py-16 animate-pulse" />}
    >
      <FormWithSearchParams section={section} />
    </Suspense>
  );
}
