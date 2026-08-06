import type { PortableTextBlock } from 'next-sanity';
import type {
  ButtonFragmentType,
  RegistrationCtaSectionFragmentType,
} from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';
import PortableText from '../modules/PortableText';

export default function RegistrationCta({
  section: { eyebrow, heading, body, buttons, note, product, uid },
}: {
  section: RegistrationCtaSectionFragmentType;
}) {
  const { spotsRemaining } = product ?? {};
  const isFull =
    spotsRemaining !== null &&
    spotsRemaining !== undefined &&
    spotsRemaining <= 0;
  const showSpots = spotsRemaining !== null && spotsRemaining !== undefined;

  return (
    <section
      id={uid ?? undefined}
      className="py-10 md:py-14 bg-white container mx-auto"
    >
      <div className="bg-gradient-to-br from-coral to-gold py-16 md:py-24 rounded-4xl container">
        <div className="max-w-3xl mx-auto text-center items-center flex flex-col px-4">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-widest text-navy/70 mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy mb-4">
              {heading}
            </h2>
          )}
          {body && (
            <div className="text-xl text-navy/90 mb-8">
              <PortableText value={body as PortableTextBlock[]} />
            </div>
          )}
          {showSpots && (
            <p
              className={`mb-4 text-sm font-bold ${isFull ? 'text-red-700' : 'text-navy/80'}`}
            >
              {isFull
                ? 'Registration is closed — no spots remaining'
                : `${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} remaining`}
            </p>
          )}
          {buttons && buttons.length > 0 && !isFull && (
            <ButtonsGroup buttons={buttons as ButtonFragmentType[]} />
          )}
          {note && <p className="mt-6 text-sm text-navy/60">{note}</p>}
        </div>
      </div>
    </section>
  );
}
