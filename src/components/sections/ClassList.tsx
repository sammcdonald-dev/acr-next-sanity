import { CalendarDays } from 'lucide-react';
import type { PortableTextBlock } from 'next-sanity';
import type {
  ButtonFragmentType,
  ClassListSectionFragmentType,
} from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';
import PortableText from '../modules/PortableText';
import { Badge } from '../ui/Badge';

export default function ClassList({
  section: { eyebrow, heading, intro, classes, button },
}: {
  section: ClassListSectionFragmentType;
}) {
  return (
    <section className="py-12 md:py-16 my-10 md:my-14">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
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
          {intro && (
            <div className="text-lg text-navy/70">
              <PortableText value={intro as PortableTextBlock[]} />
            </div>
          )}
        </div>

        {classes && classes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div
                key={cls._key}
                className="bg-white p-6 rounded-3xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-display text-lg font-semibold text-navy mb-2">
                  {cls.title}
                </h3>
                {cls.ageGroup && (
                  <Badge variant="sky" className="mb-3">
                    {cls.ageGroup}
                  </Badge>
                )}
                {(cls.day || cls.time) && (
                  <div className="flex items-center gap-2 text-sm text-navy/70">
                    <CalendarDays className="size-4 text-coral shrink-0" />
                    <span>
                      {cls.day}
                      {cls.day && cls.time ? ' · ' : ''}
                      {cls.time}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {button?.text && (
          <div className="flex justify-center mt-10">
            <ButtonsGroup
              buttons={[
                { ...button, _key: 'classListButton' } as ButtonFragmentType,
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}
