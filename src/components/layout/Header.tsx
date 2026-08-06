import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import Logo from '../icons/Logo';
import NavBar from './NavBar';

export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    tags: ['settings'],
  });

  if (!settings) {
    return null;
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm text-navy sticky top-0 z-40 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center gap-6">
        {typeof settings.title !== 'undefined' && (
          <Link className="flex items-center gap-3 shrink-0" href="/">
            <Logo />
            <span className="font-display text-xl md:text-2xl font-semibold tracking-tight">
              {settings.title}
            </span>
          </Link>
        )}
        <NavBar menuItems={settings.menu || []} />
      </div>
    </header>
  );
}
