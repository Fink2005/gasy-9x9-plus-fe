'use client';

import { Button } from '@/components/ui/button';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import SafePalIcon from '@/libs/shared/icons/SafePal';

export function SafePal() {
  const { onConnectWallet, isConnecting, addressWallet } = useSafePalWallet();

  return (
    <main className="flex-1">
      <Button
        className="btn-login mt-[0.5rem] w-full"
        onClick={onConnectWallet}
        disabled={isConnecting}
      >
        Kết nối ví
        <SafePalIcon className="ml-2 size-20" />
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
