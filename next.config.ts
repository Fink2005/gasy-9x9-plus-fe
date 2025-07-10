import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const baseConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],

  // ✅ Add your proxy rewrites here
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://backend-9x9.onrender.com/api/:path*', // 👈 Change this to your backend URL
  //     },
  //   ];
  // },
};

const config = createNextIntlPlugin('./src/libs/i18n.ts')(baseConfig);

// ✅ Final export
export default config;
