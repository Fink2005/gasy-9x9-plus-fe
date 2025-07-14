'use client';
import authRequests from '@/app/apis/requests/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CopyIcon from '@/libs/shared/icons/Copy';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  address: string;
};
const DropdownWallet = ({ address }: Props) => {
  const router = useRouter();

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Đã sao chép địa chỉ ví');
  };

  const handleLogout = async () => {
    try {
      await authRequests.logout();
      toast.success('Ngắt kết nối ví thành công');
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Có lỗi xảy ra khi ngắt kết nối ví');
    }
  };

  return (
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
          onClick={handleClipboardCopy}
        >
          <span>
            {`${address?.slice(0, 5)}...${address?.slice(-3)}`}
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
