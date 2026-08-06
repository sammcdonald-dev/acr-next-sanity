/**
 * Do not import Sanity or front-end specific code into this
 * file, it will not be tree shaken effectively across routes
 */

import { Fredoka, Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      {children}
    </html>
  );
}
