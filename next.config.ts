import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const baseConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: false,
};

const config = withNextIntl(baseConfig);

// ✅ Attach rewrites AFTER plugin
const finalConfig = {
  ...config,
  async rewrites() {
    console.log('✅ Rewrites function called'); // <--- Add this!
    return [
      {
        source: '/request/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_SERVER}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*', // Áp dụng cho tất cả các route
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/numerology/result',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/numerology/result',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/box/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300',
          },
        ],
      },
    ];
  },

};

export default finalConfig;
