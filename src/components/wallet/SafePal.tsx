'use client';
import { Button } from '@/components/ui/button';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import SafePalIcon from '@/libs/shared/icons/SafePal';

export default function SafePal() {
  const { onConnectWallet, isConnecting } = useSafePalWallet();

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
    </main>
  );
}
