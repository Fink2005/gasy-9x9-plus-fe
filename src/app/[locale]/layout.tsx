import { sfPro } from '@/app/fonts/sfPro';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/libs/i18nRouting';
import '@/styles/global.css';
import RootTemplate from '@/templates/RootTemplate';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
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
  const headersList = await headers();
  const pathName = headersList.get('x-pathname');

  setRequestLocale(locale);
  return (
    <html lang={locale} className={sfPro.variable}>
      <body>
        <NextIntlClientProvider>
          <RootTemplate>
            {props.children}
          </RootTemplate>
          <Toaster
            position="bottom-center"
            className={`${pathName === 'policy-terms' ? '' : '!bottom - 10'}`}
            toastOptions={{
              style: {
                color: 'white',
                background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)',
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
