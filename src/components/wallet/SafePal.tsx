'use client';

import { Button } from '@/components/ui/button';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import SafePalIcon from '@/libs/shared/icons/SafePal';

type Props = {
  type: 'large' | 'small';
};
export function SafePal({ type }: Props) {
  const { connectWallet, isConnecting, addressWallet } = useSafePalWallet(type);
  if (type === 'small') {
    return (
      <Button
        className="button-wallet-small"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        <span className="text-[0.75rem] font-[400]">
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
