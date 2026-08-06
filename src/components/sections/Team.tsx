import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import PortableText from '@/components/modules/PortableText';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { TeamSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function Team({
  section: { eyebrow, heading, intro, members, uid },
}: {
  section: TeamSectionFragmentType;
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
          {intro && (
            <div className="text-lg text-navy/70">
              <PortableText value={intro as PortableTextBlock[]} />
            </div>
          )}
        </div>

        {members && members.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member._id} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {member.image?.asset && (
                    <Image
                      src={
                        urlForImage(member.image)
                          ?.width(256)
                          .height(256)
                          .url() as string
                      }
                      alt={
                        member.image?.alt ||
                        `${member.firstName} ${member.lastName}`
                      }
                      width={256}
                      height={256}
                      className="w-full h-full object-cover rounded-full ring-4 ring-offwhite"
                    />
                  )}
                  <div
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold"
                    aria-hidden
                  />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy">
                  {member.firstName} {member.lastName}
                </h3>
                {member.role && (
                  <p className="text-sm font-semibold text-coral mb-3">
                    {member.role}
                  </p>
                )}
                {member.biography && (
                  <div className="text-sm text-muted-foreground text-left [&_p]:mb-2">
                    <PortableText
                      value={member.biography as PortableTextBlock[]}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
