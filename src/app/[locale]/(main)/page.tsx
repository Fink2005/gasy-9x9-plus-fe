'use client';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SafePal } from '@/components/wallet/SafePal';
import { Toaster } from 'sonner';

export default function Index() {
  // const isSafePalInstalled = window.safepal;
  // console.log('right here', isSafePalInstalled)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SafePal />
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
