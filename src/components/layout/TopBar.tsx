import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import SocialIcon from '@/components/modules/SocialIcon';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';

export default async function TopBar() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    tags: ['settings'],
  });

  if (!settings) {
    return null;
  }

  const { phone, email, socialLinks } = settings;
  const hasContact = phone || email;

  return (
    <div className="bg-navy text-white text-xs sm:text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {hasContact ? (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <Phone className="size-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <Mail className="size-3.5" />
                {email}
              </a>
            )}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-4">
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social._key}
                  href={social.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-gold transition-colors"
                >
                  <SocialIcon
                    platform={social.platform ?? ''}
                    className="size-4"
                  />
                </a>
              ))}
            </div>
          )}
          <Link
            href="/account"
            className="font-semibold underline underline-offset-4 decoration-white/40 hover:text-gold hover:decoration-gold transition-colors"
          >
            Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
