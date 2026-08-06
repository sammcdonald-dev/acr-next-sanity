import type { PortableTextBlock } from 'next-sanity';
import type { CardFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import PortableText from './PortableText';

export default function Card({
  card: { heading, content },
}: {
  card: CardFragmentType;
}) {
  return (
    <div className="relative bg-white p-6 pt-8 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-coral via-gold to-sky" />
      <h3 className="font-display text-xl font-semibold mb-3 text-navy">
        {heading}
      </h3>
      <div className="text-muted-foreground">
        <PortableText
          className="text-base"
          value={content as PortableTextBlock[]}
        />
      </div>
    </div>
  );
}
