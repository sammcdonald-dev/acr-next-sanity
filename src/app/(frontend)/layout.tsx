import '../globals.css';

import { Suspense } from 'react';
import { draftMode } from 'next/headers';
import dynamic from 'next/dynamic';
import Alert from '@/components/layout/Alert';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { SanityLive } from '@/lib/sanity/client/live';
import { handleError } from './client-utils';

const DraftModeToast = dynamic(() => import('@/components/modules/DraftModeToast'));
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster));
const VisualEditing = dynamic(() => import('next-sanity').then((mod) => mod.VisualEditing));

export const revalidate = false;

async function DraftModeUI() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <>
      <DraftModeToast />
      <VisualEditing />
      <SanityLive onError={handleError} />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className="font-inter bg-white text-black">
      <section className="min-h-screen">
        {/*<Alert />*/}
        <Toaster />
        <Header />
        <Main>{children}</Main>
        <Footer />
        <Suspense>
          <DraftModeUI />
        </Suspense>
      </section>
    </body>
  );
}
