'use client';
import { deleteCookie, getCookie } from '@/app/actions/cookie';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CopyIcon from '@/libs/shared/icons/Copy';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DropdownWallet = () => {
  const [address, setAddress] = useState<{
    original: string;
    formatted: string;
  }>({
    original: '',
    formatted: '',
  });
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const authData = await getCookie('authData');
      const address = authData ? JSON.parse(authData)?.user.address : undefined;
      const addressFormated = `${address.slice(0, 5)}...${address.slice(-3)}`;
      setAddress({ ...address, original: address, formatted: addressFormated });
    })();
  }, []);

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText(address.original);
    toast.success('Đã sao chép địa chỉ ví');
  };

  const handleLogout = async () => {
    await deleteCookie('authData');
    toast.success('Ngắt kết nối ví thành công');
    router.replace('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="bg-white rounded-[6.25rem] w-[5.625rem] h-[1.875rem] text-[0.75rem] p-1 text-white gap-[0.25rem]"
        style={{ boxShadow: '0px 20px 50px 0px rgba(54, 114, 233, 0.41)', background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)' }}
      >
        {address.formatted}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-address text-white">
        <DropdownMenuItem
          className="flex items-center justify-start !focus:bg-red-500 w-full"
          onClick={handleClipboardCopy}
        >
          <span>
            {address.formatted}
          </span>
          <CopyIcon className="min-w-[2rem] absolute right-1 top-0" />
          {' '}
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full" onClick={handleLogout}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWallet;
