import type { PortableTextBlock } from 'next-sanity';
import ContactForm from '@/components/forms/ContactForm';
import PortableText from '@/components/modules/PortableText';
import type { ContactFormSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function ContactFormSection({
  section: { eyebrow, heading, body, submitButtonLabel, uid },
}: {
  section: ContactFormSectionFragmentType;
}) {
  return (
    <section id={uid ?? undefined} className="py-12 md:py-16 my-10 md:my-14">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-widest text-coral mb-2">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-navy">
              {heading}
            </h2>
          )}
          {body && (
            <div className="text-lg text-navy/70">
              <PortableText value={body as PortableTextBlock[]} />
            </div>
          )}
        </div>

        <ContactForm submitButtonLabel={submitButtonLabel ?? 'Send Message'} />
      </div>
    </section>
  );
}
