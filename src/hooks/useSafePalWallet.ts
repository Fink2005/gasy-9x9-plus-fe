'use client';
import { createCookie } from '@/app/actions/cookie';
import authRequests from '@/app/http/requests/auth';
import connectWalletRequest from '@/app/http/requests/connectWallet';
import { useRouter } from 'nextjs-toploader/app';

import { useState } from 'react';
import { toast } from 'sonner';
// USDT contract address on Ethereum

const useSafePalWallet = () => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [addressWallet, setAddressWallet] = useState<string>('');
  const getSafePalProvider = () => {
    if (typeof window !== 'undefined' && window.safepalProvider) {
      return window.safepalProvider;
    } else {
      window.open('https://www.safepal.com/en/download?product=2');
      throw new Error('SafePal wallet not installed');
    }
  };
  const safePalMethods = {
    async onConnectWallet(invitedBy: string | null, spillover: string | null) {
      setIsConnecting(true);
      try {
        const provider = getSafePalProvider();
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
            const authData = await authRequests.login({ address: response[0], signature, message: responseNonce.nonce, ...(invitedBy ? { invitedBy } : { invitedBy: process.env.NEXT_PUBLIC_ADMIN_SYSTEM_ADDRESS }), ...(spillover && { spillover }) });
            if (authData) {
              await Promise.allSettled([
                createCookie({
                  name: 'accessToken9x9',
                  value: authData.accessToken
                }),
                createCookie({
                  name: 'authData',
                  value: JSON.stringify(authData.user),
                })
              ]);
              toast.success('Kết nối ví thành công!', {
                duration: 1000,
                onAutoClose: () => {
                  authData.user.isKyc ? router.replace('/welcome') : router.replace('/policy-terms');
                }
              });
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setIsConnecting(false);
          toast.error(error.message);
          return;
        }
        setIsConnecting(false);
        toast.error('Kết nối ví thất bại, vui lòng thử lại sau!');
      } finally {
        setIsConnecting(false);
      }
    },

  };

  return {
    safePalMethods,
    isConnecting,
    addressWallet,
  };
};

export default useSafePalWallet;
