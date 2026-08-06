import type { CtaSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';

export default function CtaSection({
  section,
}: {
  section: CtaSectionFragmentType;
}) {
  return (
    <section className="py-10 md:py-14 bg-white container mx-auto">
      <div className="relative overflow-hidden bg-navy py-16 md:py-24 rounded-4xl container">
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky/20"
          aria-hidden
        />
        <div
          className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full bg-coral/20"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto text-center items-center flex flex-col px-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            {section?.heading}
          </h2>
          <p className="text-xl text-white/80 mb-8">{section?.text}</p>

          {section?.buttons && section?.buttons.length > 0 && (
            <ButtonsGroup buttons={section?.buttons} />
          )}
        </div>
      </div>
    </section>
  );
}
