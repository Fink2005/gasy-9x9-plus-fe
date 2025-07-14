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
          setAddressWallet(response[0]);
          if (
            responseNonce
          ) {
            const signature = await provider.request({
              method: 'personal_sign',
              params: [responseNonce.nonce, response[0]]
            });
            const authData = await authRequests.login({ address: response[0], signature, message: responseNonce.nonce });
            if (authData) {
              createCookie({
                name: 'authData',
                value: JSON.stringify(authData.user),
              });
              createCookie({
                name: 'accessToken9x9',
                value: authData.accessToken
              });
              toast.success('Kết nối ví thành công!', {
                duration: 1000,
                onAutoClose: () => {
                  authData.user.isKyc ? router.replace('/') : router.replace('/policy-terms');
                }
              });
            }
          }
        }
      }
    } catch {
      toast.error('Kết nối ví thất bại, vui lòng thử lại sau!');
      // router.refresh();
      console.error('Error connecting to SafePal wallet');
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
