import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

const baseConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],

  // Rewrites added to base config
  async rewrites() {
    return [
      {
        source: '/request/:path*',
        destination: 'https://backend-9x9.onrender.com/:path*',
      },
    ];
  },
};

const config = createNextIntlPlugin('./src/libs/i18n.ts')(baseConfig);

// Final export
export default config;
