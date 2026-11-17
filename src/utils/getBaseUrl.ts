import { clientEnv } from '@/env/clientEnv';

export const getBaseUrl = () => {
  if (clientEnv.NEXT_PUBLIC_SITE_URL) {
    return clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};
