'use client';

import { Button } from '@/components/ui/button';
import SafePalIcon from '@/libs/shared/icons/SafePal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
type Props = {
  type: 'large' | 'small';
}
export function SafePal({type}: Props) {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [addressWallet, setAddressWallet] = useState<string>('');
  const router = useRouter()
  async function connectWallet() {
    setIsConnecting(true);
    try {
      const provider = window.safepalProvider;
      const message = `Welcome to 9x9 plus! Please sign this message to connect your wallet.`;
      if (!provider) {
        window.open('https://www.safepal.com/download?product=2');
        throw new Error('SafePal wallet not installed');
      }
      const response = await provider.enable();

      if (response[0]) {
        setAddressWallet(response[0]);
        // sign message
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, response[0]]
        });
        console.log(signature);
        if (type === 'large') {
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

  useEffect(() => {
    if (addressWallet) {
      toast.success('Wallet connected successfully!');
    }
  }, [addressWallet]);

if (type === 'small') {
  return (
    <Button
    className='button-wallet-small'
      onClick={connectWallet}
      disabled={isConnecting}
    >
      <span className='text-[0.75rem] font-[400]'>
      Kết nối ví
      </span>
      <SafePalIcon className="ml-2 size-15" />
    </Button>
  );
}

  return (
    <main className="flex-1">
      <Button
        className="btn-login mt-[0.5rem] w-full"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        Kết nối ví
        <SafePalIcon className="ml-2" />
      </Button>
      {addressWallet && (
        <div className="mt-4 text-center">
          <span>
            {
              `Địa chỉ ví: ${addressWallet.slice(0, 6)}...${addressWallet.slice(-4)}`
            }
          </span>
        </div>
      )}
    </main>
  );
}
