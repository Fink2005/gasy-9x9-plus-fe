'use client';
import authRequests from '@/app/http/requests/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CopyIcon from '@/libs/shared/icons/Copy';
import ExitIcon from '@/libs/shared/icons/Exit';
import LoadingDots from '@/libs/shared/icons/LoadingDots';
import UserIcon from '@/libs/shared/icons/User';
import { formatAddress, handleClipboardCopy, NumberFormat } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Web3 from 'web3';

type Props = {
  address: string;
};

// const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_CONTRACT_ADDRESS = '0xc45D0156553e000eBcdFc05B08Ea5184911e13De'; // Sepolia testnet USDT
const USDT_DECIMALS = 6;
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

// Move Web3 instance outside component to prevent recreation
let web3Instance: Web3 | null = null;

const DropdownWallet = ({ address }: Props) => {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true); // Track component mount status

  // Initialize Web3 instance only once
  const getWeb3Instance = useCallback(() => {
    if (!web3Instance && typeof window !== 'undefined' && window.ethereum) {
      web3Instance = new Web3(window.ethereum);
    }
    return web3Instance;
  }, []);

  const onGetBalance = useCallback(async () => {
    // Check if component is still mounted before proceeding
    if (!isMountedRef.current) {
      return undefined;
    }

    try {
      const web3 = getWeb3Instance();
      if (!web3 || !window.ethereum) {
        throw new Error('Web3 or Ethereum provider not available');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });

      const contract = new web3.eth.Contract(ERC20_ABI, USDT_CONTRACT_ADDRESS);
      if (!contract || !contract.methods.balanceOf) {
        throw new Error('Failed to create contract instance');
      }

      const rawBalance: string | undefined = await contract.methods.balanceOf(address).call();

      // Check again if component is still mounted before setting state
      if (!isMountedRef.current) {
        return undefined;
      }

      const balanceInUSDT = NumberFormat(Number(rawBalance || '0') / 10 ** USDT_DECIMALS);
      return balanceInUSDT;
    } catch (error) {
      console.error('Balance fetch error:', error);
      // Only show toast if component is still mounted
      if (isMountedRef.current) {
        toast.error('Failed to fetch balance');
      }
      return undefined;
    }
  }, [address, getWeb3Instance]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut || !isMountedRef.current) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await authRequests.logout();

      // Only proceed if component is still mounted
      if (isMountedRef.current) {
        window.localStorage.removeItem('isDisplayTutorial');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      if (isMountedRef.current) {
        toast.error('Error disconnecting wallet');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoggingOut(false);
      }
    }
  }, [isLoggingOut, router]);

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

    fetchBalance(); // Initial fetch
    intervalRef.current = setInterval(fetchBalance, 2000);

    return () => {
      isMountedRef.current = false; // Mark component as unmounted
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [address, fetchBalance]);

  // Cleanup on unmount
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
          {formatAddress(address, 5)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-address text-white">
          <DropdownMenuItem className="w-full" onClick={() => router.push(`/profile`)}>
            <UserIcon className="absolute left-1 -top-[1px]" />
            <span className="w-full translate-x-8">
              Profile
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-start !focus:bg-red-500 w-full"
            onClick={() => handleClipboardCopy(address)}
          >
            <span className="w-full text-right">
              {formatAddress(address, 5)}
            </span>
            <CopyIcon className="absolute left-1 top-0" />
            {' '}
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" onClick={handleLogout}>
            <ExitIcon className=" absolute left-1 -top-[1px]" />
            <span className="w-full text-right -translate-x-1">
              Disconnect
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownWallet;
