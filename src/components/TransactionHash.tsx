/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import useGetCookie from '@/hooks/useGetCookie';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Web3 } from 'web3';

import { deleteCookie } from '@/app/actions/cookie';
import { handleRevalidatePath, handleRevalidateTag } from '@/app/actions/revalidation';
import { boxRequest } from '@/app/http/requests/box';
import BoxDistributor from '@/contracts/BoxDistributor.json';
import useBoxStore from '@/store/useBoxStore';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;

const API_BNB_KEY = process.env.NEXT_PUBLIC_API_BNB_KEY;

const TRANSACTION_CHECKING_ROUTE = ['/', '/gold-mining', '/numerology', '/mission', '/ranking', '/box', '/profile'];

const etherUrl = 'https://api.etherscan.io/v2/api';

const TransactionHash = () => {
  const { handleGetCookie } = useGetCookie();
  const getAddress = async () => {
    const authData = await handleGetCookie('authData');
    const userAddress = (authData as { address: string })?.address;
    return { userAddress };
  };
  const router = useRouter();
  const pathname = usePathname();
  let intervalId: NodeJS.Timeout | null = null;

  const { clearBox, setLoading, handleOpenBox } = useBoxStore(
    useShallow(
      state => ({
        clearBox: state.clearBox,
        setLoading: state.setLoading,
        handleOpenBox: state.handleOpenBox
      })
    ),
  );

  const getAllowanceEtherscan = async (owner: string, spender: string) => {
    const methodId = '0xdd62ed3e'; // allowance(address,address)

    const ownerPadded = owner.replace('0x', '').toLowerCase().padStart(64, '0');
    const spenderPadded = spender.replace('0x', '').toLowerCase().padStart(64, '0');

    const data = methodId + ownerPadded + spenderPadded;
    // ✅ Correct - this is Sepolia testnet
    const url = `${etherUrl}?chainId=56&module=proxy&action=eth_call&to=${USDT_ADDRESS}&data=${data}&tag=latest&apikey=${API_BNB_KEY}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      console.log(json);

      if (!json.result || json.result === '0x' || json.result === '0x0') {
        console.log('123');
        return 0; // not approved yet
      }

      const rawAllowance = BigInt(json.result); // hex → number
      console.log(rawAllowance);
      return Number(rawAllowance) / 1e18; // USDT has 18 decimals
    } catch (err) {
      clearBox();
      clearInterval(intervalId as any);
      console.error('Fetch allowance error:', err);
      return 0;
    }
  };

  const MethodId = (type: 'openBox' | 'approve') => {
    // Your openBox function signature from the ABI
    return type === 'openBox' ? '0xc20897b5' : '0x095ea7b3';
  };

  const getLatestOpenBoxTransaction = async (address: string) => {
    const openBoxMethodId = MethodId('openBox');

    try {
      const response = await fetch(
        `${etherUrl}?chainId=56&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${API_BNB_KEY}`
      );

      const data = await response.json();

      console.log(data);
      const openTransactionLength = data?.result?.filter((item: { methodId: string }) => item.methodId === openBoxMethodId).length;
      if (data.status === '1') {
        // Find the first transaction that matches openBox method
        for (const tx of data.result) {
          // Filter by contract address if specified
          if (contractAddress && tx.to?.toLowerCase() !== contractAddress.toLowerCase()) {
            continue;
          }

          // Check if transaction calls openBox method
          if (tx.methodId === openBoxMethodId) {
            return {
              openTransactionLength,
              transactionHash: tx.hash,
            };
          }
        }

        return null; // No openBox transaction found
      } else {
        console.error(data.message || 'Failed to fetch transactions');
        return null; // Explicitly return null in case of failure
      }
    } catch (error) {
      console.error('Error fetching latest openBox transaction:', error);
      return null; // Explicitly return null in case of an error
    }
  };

  const getLatestApproveTransaction = async (address: string) => {
    const approveMethodId = MethodId('approve');

    try {
      const response = await fetch(
        `${etherUrl}?chainId=56&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${API_BNB_KEY}`
      );

      const data = await response.json();

      console.log(data);

      if (data.status === '1') {
        // Find the first transaction that matches openBox method
        const { hash } = data.result.find((item: { methodId: string; hash: string }) => item.methodId === approveMethodId);
        return hash;
      } else {
        console.error(data.message || 'Failed to fetch transactions');
        return null; // Explicitly return null in case of failure
      }
    } catch (error) {
      clearInterval(intervalId as any);
      clearBox();
      console.error('Error fetching latest openBox transaction:', error);
      return null; // Explicitly return null in case of an error
    }
  };

  useEffect(() => {
    // (
    //   async () => {
    //     const openBoxHash = await getLatestOpenBoxTransaction('0xb3c07d1ffe5ad5d38d69305232844f10b780a6b9');
    //     console.log(openBoxHash);
    //     await boxRequest.boxOpen(openBoxHash?.transactionHash);
    //   }
    // )();

    // (
    //   async () => {
    //     const isApproving = await getAllowanceEtherscan('0xb3c07d1ffe5ad5d38d69305232844f10b780a6b9', contractAddress);
    //     console.log(isApproving);
    //     const a = await getLatestApproveTransaction('0xb3c07d1ffe5ad5d38d69305232844f10b780a6b9');
    //     console.log(a);
    //   }
    // )();

    const isOnValidRoute = TRANSACTION_CHECKING_ROUTE.includes(pathname);

    const handleBoxError = async (currentBox: number) => {
      const { userAddress: address } = await getAddress();
      const web3 = new Web3(window.ethereum); // or your provider
      const contract = new web3.eth.Contract(BoxDistributor, contractAddress);
      const isApproving = await getAllowanceEtherscan(address, contractAddress!);
      console.log(isApproving);
      try {
        if (isApproving) {
          console.log('is approving');
          const approveHash = await getLatestApproveTransaction(address);
          handleOpenBox({
            txHash: approveHash,
            currentBox
          });
        } else {
          const handleRetryOpenBox = async () => {
            const onChainCurrentBox = Number((await contract.methods.boxesOpened!(address).call()));
            const openBoxHash = await getLatestOpenBoxTransaction(address);
            console.log(onChainCurrentBox, currentBox, openBoxHash?.openTransactionLength);

            if (onChainCurrentBox === currentBox && onChainCurrentBox === openBoxHash?.openTransactionLength) {
              clearInterval(intervalId as unknown as number);

              try {
                if (!openBoxHash) {
                  return;
                }
                await boxRequest.boxOpen(openBoxHash.transactionHash);
                await Promise.allSettled([
                  handleRevalidateTag('get-me'),
                  handleRevalidatePath('/'),
                ]);

                router.refresh();
              } finally {
                await deleteCookie('boxData');
                clearInterval(intervalId as unknown as number);
                setLoading(false, currentBox as number);
                clearBox();
              }
            }
          };

          intervalId = setInterval(handleRetryOpenBox, 10000);
        }
      } catch {
        toast.error('Có lỗi xảy ra trong quá trình kiểm tra giao dịch. Vui lòng liên hệ với admin nếu lỗi vẫn tiếp diễn.');
      }
    };
    handleGetCookie('boxData').then(async (result) => {
      if (result) {
        const { isConfirmed, currentBox } = result as { isConfirmed: boolean; currentBox: number };
        if (isConfirmed && isOnValidRoute) {
          handleBoxError(currentBox);
        }
      }
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pathname, router]);

  return null;
};

export default TransactionHash;
