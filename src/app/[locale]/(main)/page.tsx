'use client';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function Index() {
  // const isSafePalInstalled = window.safepal;
  // console.log('right here', isSafePalInstalled)

  return (
    <div className="min-h-screen bg-home relative">
      <Header />
      <Footer />
    </div>
  );
}
