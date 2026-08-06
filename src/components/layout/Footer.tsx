import Link from 'next/link';
import SocialIcon from '@/components/modules/SocialIcon';
import { getLinkByLinkObject } from '@/lib/links';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import Logo from '../icons/Logo';

export default async function Footer() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    tags: ['settings'],
  });

  if (!settings) {
    return null;
  }

  const { phone, email, address, socialLinks, menu } = settings;

  return (
    <footer className="bg-navy text-white/70 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Logo />
              <h3 className="font-display text-lg font-semibold">
                {settings.title}
              </h3>
            </div>
            <p className="text-sm">{settings.description}</p>
          </div>

          {menu && menu.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                {menu.map((item) => (
                  <li key={item._key}>
                    <Link
                      href={
                        item.link ? getLinkByLinkObject(item.link) || '#' : '#'
                      }
                      className="hover:text-gold transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/account"
                    className="hover:text-gold transition-colors"
                  >
                    Customer Portal
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {(phone || email || address) && (
            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-sm">
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                      className="hover:text-gold transition-colors"
                    >
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-gold transition-colors"
                    >
                      {email}
                    </a>
                  </li>
                )}
                {address && <li>{address}</li>}
              </ul>
            </div>
          )}

          {socialLinks && socialLinks.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social._key}
                    href={social.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-gold transition-colors"
                  >
                    <SocialIcon
                      platform={social.platform ?? ''}
                      className="size-6"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} {settings.title}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
