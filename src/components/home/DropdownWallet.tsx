'use client';
import { deleteCookie } from '@/app/actions/cookie';
import authRequests from '@/app/http/requests/auth';
import { Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CopyIcon from '@/libs/shared/icons/Copy';
import ExitIcon from '@/libs/shared/icons/Exit';
import LoadingDots from '@/libs/shared/icons/LoadingDots';
import UserIcon from '@/libs/shared/icons/User';
import { formatAddress, handleClipboardCopy, NumberFormat } from '@/libs/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, TriangleAlert } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { useCallback, useEffect, useRef, useState } from 'react';
import Web3 from 'web3';

type Props = {
  address: string;
};

const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;
const USDT_DECIMALS = 18;
const RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL!;
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

// Hỗ trợ BNB mainnet và testnet
const BNB_CHAIN_IDS = ['0x38'];

let httpWeb3Instance: Web3 | null = null;
let httpContractInstance: any = null;

const DropdownWallet = ({ address }: Props) => {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [, setWarningEth] = useState<boolean>(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const queryClient = useQueryClient();

  const getHttpWeb3Instance = useCallback(() => {
    if (!httpWeb3Instance) {
      httpWeb3Instance = new Web3(new Web3.providers.HttpProvider(RPC_URL));
      httpContractInstance = new httpWeb3Instance.eth.Contract(ERC20_ABI, USDT_ADDRESS);
    }
    return { web3: httpWeb3Instance, contract: httpContractInstance };
  }, []);

  const checkNetwork = useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        if (!BNB_CHAIN_IDS.includes(chainId)) {
          setWarningEth(true);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Network check error:', err);
        setWarningEth(true);
        return false;
      }
    }
    return false;
  }, []);

  const onGetBalance = useCallback(async () => {
    if (!isMountedRef.current) {
      return undefined;
    }

    try {
      const { contract } = getHttpWeb3Instance();
      if (!contract || !contract.methods.balanceOf) {
        throw new Error('Contract instance not available');
      }

      const rawBalance: string | undefined = await contract.methods.balanceOf(address).call();
      if (!isMountedRef.current) {
        return undefined;
      }

      const balanceInUSDT = NumberFormat(Number(rawBalance || '0') / 10 ** USDT_DECIMALS);
      return balanceInUSDT;
    } catch (error) {
      console.error('Balance fetch error:', error);
      return undefined;
    }
  }, [address, getHttpWeb3Instance]);

  const handleLogout = useCallback(async () => {
    queryClient.clear();
    setIsLoggingOut(true);
    try {
      await Promise.allSettled([authRequests.logout(), deleteCookie('isShouldRefetch')]);
      router.replace('/login');
    } catch {
      await Promise.allSettled([
        deleteCookie('authData'),
        deleteCookie('accessToken9x9'),
        deleteCookie('refreshToken9x9'),
        deleteCookie('isShouldRefetch'),
      ]);
      window.location.href = '/login';
    } finally {
      if (isMountedRef.current) {
        setIsLoggingOut(false);
      }
    }
  }, [queryClient, router]);

  const fetchBalance = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }
    const USDTbalance = await onGetBalance();
    if (USDTbalance && isMountedRef.current) {
      setBalance(USDTbalance);
    }
  }, [onGetBalance]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!address) {
      return;
    }

    (async () => {
      const isCorrectNetwork = await checkNetwork();
      if (isCorrectNetwork) {
        fetchBalance(); // Initial fetch
        intervalRef.current = setInterval(fetchBalance, 2000);
      }
    })();

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [address, fetchBalance, checkNetwork]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (!address) {
    return null;
  }

  return (
    <div className="flex items-center">
      <div className="text-shadow-custom text-[0.75rem] font-[510] border-r border-r-white px-3 me-3 h-5 flex items-center">
        {!balance ? <LoadingDots size="size-1" /> : <span>{balance}</span>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="bg-white rounded-[6.25rem] w-[5.625rem] h-[1.875rem] text-[0.75rem] p-1 text-white gap-[0.25rem]"
          style={{
            boxShadow: '0px 20px 50px 0px rgba(54, 114, 233, 0.41)',
            background: 'linear-gradient(180deg, #68DAF2 0%, #1C5BB9 95.1%)',
          }}
        >
          {formatAddress(address, 5)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-address text-white">
          <DropdownMenuItem className="w-full" onClick={() => router.push(`/profile`)}>
            <UserIcon className="absolute left-1 -top-[1px]" />
            <span className="w-full translate-x-8">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-start !focus:bg-red-500 w-full"
            onClick={() => handleClipboardCopy(address)}
          >
            <span className="w-full text-right">{formatAddress(address, 5)}</span>
            <CopyIcon className="absolute left-1 top-0" />
            {' '}
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" onClick={handleLogout}>
            <ExitIcon className=" absolute left-1 -top-[1px]" />
            <span className="w-full text-right -translate-x-1">Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-1/2 confirm-dialog gap-3 max-w-[512px] h-[331px] w-full flex flex-col justify-center">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-shadow-custom font-semibold text-2xl">Đổi mạng sang BNB</DialogTitle>
            <TriangleAlert className="size-[100px] text-shadow-custom" />
            <DialogDescription className="text-shadow-custom">
              Vui lòng kết nối mạng BNB để sử dụng app
            </DialogDescription>
          </DialogHeader>
          <Button className="w-1/2 button-custom" onClick={() => handleLogout()}>
            {isLoggingOut ? <Loader2 className="animate-spin" /> : 'OK'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DropdownWallet;
