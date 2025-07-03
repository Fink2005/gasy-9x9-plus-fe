'use client';
import { createCookie } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import connectWalletRequest from '@/app/apis/requests/connectWallet';
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
        if (!provider) {
          window.open('https://www.safepal.com/en/download?product=2');
          throw new Error('SafePal wallet not installed');
        }
        const response = await provider.enable();

        if (response[0]) {
          const responseNonce = await connectWalletRequest.getNonce(response[0]);
          if (
            responseNonce
          ) {
            const signature = await provider.request({
              method: 'personal_sign',
              params: [responseNonce.nonce, response[0]]
            });
            const authData = await authRequests.login({ address: response[0], signature, message: responseNonce.nonce });

            if (authData) {
              setAddressWallet(authData.result.address);
              createCookie({
                name: 'authData',
                value: JSON.stringify({
                  address: authData.result.address,
                  accessToken: authData.result.accessToken,
                }),
              });
              toast.success('Wallet connected successfully!');
              router.replace('/policy-terms');
            }
          }
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
      setIsConnecting(false);
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
