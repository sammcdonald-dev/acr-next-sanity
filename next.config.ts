import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['stripe'],
  experimental: {
    turbo: {
      resolveAlias: {
        // Stripe v16+ has a broken exports field that Turbopack can't resolve.
        // Point it directly at the CJS Node.js entry so dev works.
        stripe: 'stripe/cjs/stripe.cjs.node.js',
      },
    },
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
