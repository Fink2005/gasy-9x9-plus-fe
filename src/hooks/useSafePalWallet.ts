'use client';
import { createCookie } from '@/actions/cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const useSafePalWallet = () => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [addressWallet, setAddressWallet] = useState<string>('');
  async function onConnectWallet() {
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined') {
        const provider = window.safepalProvider;
        const message = `Welcome to 9x9 plus! Please sign this message to connect your wallet.`;
        if (!provider) {
          window.open('https://www.csafepal.com/download?product=2');
          throw new Error('SafePal wallet not installed');
        }
        const response = await provider.enable();

        if (response[0]) {
          setAddressWallet(response[0]);
          // sign message
          await provider.request({
            method: 'personal_sign',
            params: [message, response[0]]
          });
          // const a = await connectWallet.getNonce(response[0]);
          createCookie({
            name: 'walletAddress',
            value: response[0],
          });

          toast.success('Wallet connected successfully!');

          router.replace('/policy-terms');
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }

  return {
    onConnectWallet,
    isConnecting,
    addressWallet,
  };
};

export default useSafePalWallet;
