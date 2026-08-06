import type { PortableTextBlock } from 'next-sanity';
import type { ClassScheduleSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import PortableText from '../modules/PortableText';
import { Badge } from '../ui/Badge';

export default function ClassSchedule({
  section: { eyebrow, heading, body, classes, uid },
}: {
  section: ClassScheduleSectionFragmentType;
}) {
  return (
    <section id={uid ?? undefined} className="py-12 md:py-16 my-10 md:my-14">
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
          {body && (
            <div className="text-lg text-navy/70">
              <PortableText value={body as PortableTextBlock[]} />
            </div>
          )}
        </div>

        {classes && classes.length > 0 && (
          <div className="overflow-x-auto rounded-3xl border border-border shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-navy text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Age Group</th>
                  <th className="px-6 py-4">Day</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((cls) => (
                  <tr
                    key={cls._key}
                    className="bg-white hover:bg-offwhite transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-navy">
                      {cls.title}
                      {cls.description && (
                        <p className="text-muted-foreground font-normal mt-1">
                          {cls.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {cls.ageGroup && (
                        <Badge variant="sky">{cls.ageGroup}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-navy/70">{cls.day}</td>
                    <td className="px-6 py-4 text-navy/70">{cls.time}</td>
                    <td className="px-6 py-4 font-semibold text-coral">
                      {cls.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
