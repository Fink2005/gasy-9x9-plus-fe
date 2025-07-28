'use client';
import authRequests from '@/app/apis/requests/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import CopyIcon from '@/libs/shared/icons/Copy';
import LoadingDots from '@/libs/shared/icons/LoadingDots';
import { handleClipboardCopy } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  address: string;
};

const DropdownWallet = ({ address }: Props) => {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { safePalMethods } = useSafePalWallet();

  const handleLogout = useCallback(async () => {
    try {
      await authRequests.logout();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('isDisplayTutorial');
      }
      toast.success('Ngắt kết nối ví thành công');
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Có lỗi xảy ra khi ngắt kết nối ví');
    }
  }, [router]);

  const fetchUSDT = useCallback(async () => {
    try {
      const USDTBalance = await safePalMethods.onGetBalance(address);
      if (USDTBalance) {
        setBalance(USDTBalance);
      }
    } catch (error) {
      console.error('Failed to fetch USDT balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, safePalMethods]);

  useEffect(() => {
    let USDTInterval: NodeJS.Timeout | null = null;

    setIsLoading(true);

    // Initial fetch with delay
    const timeoutId = setTimeout(fetchUSDT, 500);

    // Set up interval for periodic updates
    USDTInterval = setInterval(fetchUSDT, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (USDTInterval) {
        clearInterval(USDTInterval);
      }
    };
  }, [fetchUSDT]);

  const handleCopyAddress = useCallback(() => {
    handleClipboardCopy(address);
  }, [address]);

  const formatAddress = useCallback((addr: string) => {
    return `${addr?.slice(0, 5)}...${addr?.slice(-3)}`;
  }, []);

  return (
    <div className="flex items-center">
      <div className="text-shadow-custom text-[0.75rem] font-[510] border-r border-r-white px-3 me-3 h-5 flex items-center">
        {isLoading ? (
          <LoadingDots size="size-1" />
        ) : (
          <span>{balance}</span>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="bg-white rounded-[6.25rem] w-[5.625rem] h-[1.875rem] text-[0.75rem] p-1 text-white gap-[0.25rem]"
          style={{
            boxShadow: '0px 20px 50px 0px rgba(54, 114, 233, 0.41)',
            background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)'
          }}
        >
          {formatAddress(address)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-address text-white">
          <DropdownMenuItem
            className="flex items-center justify-between cursor-pointer hover:bg-opacity-10 hover:bg-white w-full"
            onClick={handleCopyAddress}
          >
            <span>{formatAddress(address)}</span>
            <CopyIcon className="ml-2" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="w-full cursor-pointer hover:bg-opacity-10 hover:bg-white"
            onClick={handleLogout}
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownWallet;
