'use client';

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SafePal() {
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    setIsConnecting(true);

    try {
      const provider = window.safepal;

      if (!provider) {
        window.open('https://www.safepal.com/download?product=2');
        throw new Error('SafePal wallet not installed');
      }

      await provider.connect();
      const publicKey = await provider.getAccount();
      console.log('Connected to wallet:', publicKey.toString());
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.success('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Fink
              </span>
              <br />
              <span className="text-foreground">Web3 Experience</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect your SafePal wallet and explore the future of decentralized applications with seamless integration and premium security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg h-auto"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect SafePal Wallet'}
              </Button>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
