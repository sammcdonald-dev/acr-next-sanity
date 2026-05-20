import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery, pageSlugs } from '@/lib/sanity/queries/queries';

export const revalidate = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(pageSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs ? slugs.filter((slug) => slug !== null).map((slug) => ({ slug })) : [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
    tags: ['page'],
  });

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(page.seo, page?.name || '');
}

export default async function Page(props: Props) {
  const params = await props.params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
    tags: ['page'],
  });

  if (!page) {
    notFound();
  }

  const { _id, _type, pageSections } = page;

  return <PageSections documentId={_id} documentType={_type} sections={pageSections} />;
}
