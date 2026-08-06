import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import PortableText from '@/components/modules/PortableText';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { HeroSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';

export default function HeroSection({
  section,
}: {
  section: HeroSectionFragmentType;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20">
      <div className="container mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-6 text-navy">
              {section?.heading}
            </h1>
            <PortableText
              className="text-lg md:text-xl text-navy/80"
              value={section.text as PortableTextBlock[]}
            />

            {section?.buttons?.length ? (
              <div className="mt-8 gap-4 flex">
                {section?.buttons.length > 1 && (
                  <ButtonsGroup
                    className="w-full md:w-auto"
                    buttons={section?.buttons}
                  />
                )}
              </div>
            ) : null}
          </div>
          <div className="relative">
            {section.image?.asset && (
              <Image
                src={
                  urlForImage(section.image)
                    ?.width(1000)
                    .height(667)
                    .url() as string
                }
                alt={section?.image?.alt || ''}
                width={600}
                height={400}
                className="rounded-4xl shadow-xl relative z-10"
              />
            )}
            <div
              className="absolute -bottom-6 -left-6 w-28 h-28 bg-gold rounded-full opacity-80 animate-float"
              aria-hidden
            />
            <div
              className="absolute -top-6 -right-6 w-20 h-20 bg-coral rounded-full opacity-80 animate-float"
              style={{ animationDelay: '1.5s' }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
