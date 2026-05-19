import type { PortableTextBlock } from 'next-sanity';
import type { ClassScheduleSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import PortableText from '../modules/PortableText';

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
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              {eyebrow}
            </p>
          )}
          {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
          {body && (
            <div className="text-lg text-gray-600">
              <PortableText value={body as PortableTextBlock[]} />
            </div>
          )}
        </div>

        {classes && classes.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Age Group</th>
                  <th className="px-6 py-4">Day</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classes.map((cls) => (
                  <tr key={cls._key} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cls.title}
                      {cls.description && (
                        <p className="text-gray-500 font-normal mt-1">{cls.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cls.ageGroup}</td>
                    <td className="px-6 py-4 text-gray-600">{cls.day}</td>
                    <td className="px-6 py-4 text-gray-600">{cls.time}</td>
                    <td className="px-6 py-4 text-gray-600">{cls.rate}</td>
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
