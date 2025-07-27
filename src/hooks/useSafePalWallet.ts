'use client';
import { createCookie } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import connectWalletRequest from '@/app/apis/requests/connectWallet';
import { NumberFormat } from '@/libs/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Web3 from 'web3';
// USDT contract address on Ethereum
// const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_CONTRACT_ADDRESS = '0xc45D0156553e000eBcdFc05B08Ea5184911e13De'; // this is for Sepolia testnet USDT

// USDT has 6 decimal places
const USDT_DECIMALS = 6;
// Simple ERC-20 ABI - only need balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  }
];
const useSafePalWallet = () => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [addressWallet, setAddressWallet] = useState<string>('');
  const getSafePalProvider = () => {
    if (typeof window !== 'undefined' && window.safepalProvider) {
      return window.safepalProvider;
    } else {
      window.open('https://www.safepal.com/en/download?product=2');
      throw new Error('SafePal wallet not installed');
    }
  };
  const safePalMethods = {
    async onConnectWallet(invitedBy: string | null) {
      setIsConnecting(true);
      try {
        const provider = getSafePalProvider();
        if (!provider) {
          window.open('https://www.safepal.com/en/download?product=2');
          throw new Error('SafePal wallet not installed');
        }
        const response = await provider.enable();
        if (response[0]) {
          const responseNonce = await connectWalletRequest.getNonce(response[0]);
          setAddressWallet(response[0]);
          if (
            responseNonce
          ) {
            const signature = await provider.request({
              method: 'personal_sign',
              params: [responseNonce.nonce, response[0]]
            });
            const authData = await authRequests.login({ address: response[0], signature, message: responseNonce.nonce, ...(invitedBy && { invitedBy }) });
            if (authData) {
              createCookie({
                name: 'authData',
                value: JSON.stringify(authData.user),
              });
              createCookie({
                name: 'accessToken9x9',
                value: authData.accessToken
              });
              toast.success('Kết nối ví thành công!', {
                duration: 1000,
                onAutoClose: () => {
                  authData.user.isKyc ? router.replace('/') : router.replace('/policy-terms');
                }
              });
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
        setIsConnecting(false);
          toast.error(error.message);
          return
        }
        setIsConnecting(false);
        toast.error('Kết nối ví thất bại, vui lòng thử lại sau!');
      } finally {
        setIsConnecting(false);
      }
    },
    async onGetBalance(address: string) {
      if (typeof window.ethereum === 'undefined') {
        toast.error('Vui lòng cài đặt ví');
        return;
      }
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 = Sepolia chain ID in hex
      });

      // Create contract instance
      const contract = new web3.eth.Contract(ERC20_ABI, USDT_CONTRACT_ADDRESS);
      if (!contract || !contract.methods.balanceOf) {
        throw new Error('Failed to create contract instance or balanceOf method is undefined.');
      }

      // Get balance
      const rawBalance = await contract.methods.balanceOf(address).call();

      // Convert balance from wei to USDT (6 decimals)
      const balanceInUSDT = NumberFormat(Number.parseFloat(String(rawBalance)) / 10 ** USDT_DECIMALS);
      return balanceInUSDT;
    },

  };

  return {
    safePalMethods,
    isConnecting,
    addressWallet,
  };
};

export default useSafePalWallet;
