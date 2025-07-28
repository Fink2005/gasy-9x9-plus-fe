'use client';
import authRequests from '@/app/apis/requests/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import CopyIcon from '@/libs/shared/icons/Copy';
import LoadingDots from '@/libs/shared/icons/LoadingDots';
import { handleClipboardCopy } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  address: string;
};

const DropdownWallet = ({ address }: Props) => {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { safePalMethods } = useSafePalWallet();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    } // Prevent double-click

    setIsLoggingOut(true);
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
      setIsLoggingOut(false); // Reset on error
    }
  }, [isLoggingOut, router]);

  const fetchBalance = useCallback(async () => {
    try {
      const USDTbalance = await safePalMethods.onGetBalance(address);
      if (USDTbalance) {
        setBalance(USDTbalance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      // Optionally show error toast or handle error state
    }
  }, [address, safePalMethods]);

  useEffect(() => {
    if (!address) {
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch with delay
    const timeoutId = setTimeout(fetchBalance, 500);

    // Set up polling interval
    intervalRef.current = setInterval(fetchBalance, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [address, fetchBalance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // const formatAddress = (addr: string) => `${addr?.slice(0, 5)}...${addr?.slice(-3)}`;

  if (!address) {
    return null; // Or some fallback UI
  }

  return (
    <div className="flex items-center">
      <div className="text-shadow-custom text-[0.75rem] font-[510] border-r border-r-white px-3 me-3 h-5 flex items-center">
        {!balance ? <LoadingDots size="size-1" /> : (
          <span>
            {balance}
          </span>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="bg-white rounded-[6.25rem] w-[5.625rem] h-[1.875rem] text-[0.75rem] p-1 text-white gap-[0.25rem]"
          style={{ boxShadow: '0px 20px 50px 0px rgba(54, 114, 233, 0.41)', background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)' }}
        >
          {`${address?.slice(0, 5)}...${address?.slice(-3)}`}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-address text-white">
          <DropdownMenuItem
            className="flex items-center justify-start !focus:bg-red-500 w-full"
            onClick={() => handleClipboardCopy(address)}
          >
            <span>
              {`${address?.slice(0, 5)}...${address?.slice(-3)}`}
            </span>
            <CopyIcon className=" absolute right-1 top-0" />
            {' '}
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" onClick={handleLogout}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownWallet;
