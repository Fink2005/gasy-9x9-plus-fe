'use client';
import authRequests from '@/app/apis/requests/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useSafePalWallet from '@/hooks/useSafePalWallet';
import CopyIcon from '@/libs/shared/icons/Copy';
import LoadingDots from '@/libs/shared/icons/LoadingDots';
import { handleClipboardCopy } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  address: string;
};

const DropdownWallet = ({ address }: Props) => {
  const [balance, setBalance] = useState<string>('0');
  const router = useRouter();
  const { safePalMethods } = useSafePalWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      await authRequests.logout();
      typeof window !== 'undefined' && window.localStorage.removeItem('isDisplayTutorial');
      toast.success('Ngắt kết nối ví thành công');
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Có lỗi xảy ra khi ngắt kết nối ví');
    }
  };
  useEffect(() => {
    let USDTInterval = null;

    const fetchUSDT = async () => {
      try {
        const USDTbalance = await safePalMethods.onGetBalance(address);
        if (USDTbalance) {
          setBalance(USDTbalance);
        }
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true); // Only set loading on first mount
    fetchUSDT();
    USDTInterval = setInterval(fetchUSDT, 2000);

    return () => {
      if (USDTInterval) {
        clearInterval(USDTInterval);
      }
    };
  }, [address, safePalMethods]);
  return (
    <div className="flex items-center">
      <div className="text-shadow-custom text-[0.75rem] font-[510] border-r border-r-white px-3 me-3 h-5 flex items-center">
        {isLoading ? <LoadingDots size="size-1" /> : (
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
