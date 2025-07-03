'use client';
import { deleteCookie, getCookie } from '@/app/actions/cookie';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CopyIcon from '@/libs/shared/icons/Copy';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DropdownWallet = () => {
  const [address, setAddress] = useState<string>('');
  const addressFormated = address ? `${address.slice(0, 5)}...${address.slice(-3)}` : '';
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const authData = await getCookie('authData');
      const address = authData ? JSON.parse(authData)?.address : undefined;
      setAddress(address);
    })();
  }, []);

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Copied to clipboard!');
  };

  const handleLogout = async () => {
    await deleteCookie('authData');
    toast.success('Disconnected successfully!');
    router.replace('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="bg-white rounded-[6.25rem] w-[5.625rem] h-[1.875rem] text-[0.75rem] p-1 text-white gap-[0.25rem]"
        style={{ boxShadow: '0px 20px 50px 0px rgba(54, 114, 233, 0.41)', background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)' }}
      >
        {addressFormated}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-address text-white">
        <DropdownMenuItem
          className="flex items-center justify-center !focus:bg-red-500"
          onClick={handleClipboardCopy}
        >
          <span>
            {addressFormated}
          </span>
          {' '}
          <CopyIcon />
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full" onClick={handleLogout}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWallet;
