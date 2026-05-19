import type { PortableTextBlock } from 'next-sanity';
import type { RegistrationCtaSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import type { ButtonFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';
import PortableText from '../modules/PortableText';

export default function RegistrationCta({
  section: { eyebrow, heading, body, buttons, note, product, uid },
}: {
  section: RegistrationCtaSectionFragmentType;
}) {
  const { spotsRemaining } = product ?? {};
  const isFull = spotsRemaining !== null && spotsRemaining !== undefined && spotsRemaining <= 0;
  const showSpots = spotsRemaining !== null && spotsRemaining !== undefined;

  return (
    <section id={uid ?? undefined} className="py-10 md:py-14 bg-white container mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 py-16 md:py-24 rounded-4xl container">
        <div className="max-w-3xl mx-auto text-center items-center flex flex-col">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
          )}
          {body && (
            <div className="text-xl text-white/90 mb-8">
              <PortableText value={body as PortableTextBlock[]} />
            </div>
          )}
          {showSpots && (
            <p className={`mb-4 text-sm font-semibold ${isFull ? 'text-red-200' : 'text-white/80'}`}>
              {isFull ? 'Registration is closed — no spots remaining' : `${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} remaining`}
            </p>
          )}
          {buttons && buttons.length > 0 && !isFull && (
            <ButtonsGroup buttons={buttons as ButtonFragmentType[]} />
          )}
          {note && <p className="mt-6 text-sm text-white/60">{note}</p>}
        </div>
      </div>
    </section>
  );
}
