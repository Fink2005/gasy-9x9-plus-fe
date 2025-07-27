import { sfPro } from '@/app/fonts/sfPro';
import RefreshToken from '@/components/refresh-token';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/libs/i18nRouting';
import '@/styles/global.css';
import RootTemplate from '@/templates/RootTemplate';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/icon0.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
    <html lang={locale} className={sfPro.variable}>
      <body className="min-h-screen">
        <head>
          <meta name="apple-mobile-web-app-title" content="9x9plus" />
        </head>
        <NextIntlClientProvider>
          <RefreshToken />
          <RootTemplate>
            {props.children}
          </RootTemplate>
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'text-white bg-gradient-to-b from-[#68DAF2] to-[#1C5BB9]',
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
