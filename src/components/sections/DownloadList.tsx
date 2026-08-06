import { FileTextIcon } from 'lucide-react';
import type { PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';
import type { DownloadListSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

function formatFileSize(bytes?: number | null) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function DownloadList({
  section: { heading, intro, files, uid },
}: {
  section: DownloadListSectionFragmentType;
}) {
  return (
    <section id={uid ?? undefined} className="py-12 md:py-16 my-10 md:my-14">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-8">
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

        {files && files.length > 0 && (
          <ul className="max-w-2xl divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {files.map((item) => {
              const asset = item.file?.asset;
              if (!asset?.url) return null;
              const size = formatFileSize(asset.size);

              return (
                <li key={item._key}>
                  <a
                    href={asset.url}
                    download={asset.originalFilename ?? undefined}
                    className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-offwhite transition-colors"
                  >
                    <span className="flex items-center justify-center size-10 rounded-full bg-sky/15 text-sky shrink-0">
                      <FileTextIcon className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-navy">
                        {item.title || asset.originalFilename || 'Download'}
                      </span>
                      {size && (
                        <span className="block text-xs text-muted-foreground">
                          {size}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-coral">
                      Download
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
