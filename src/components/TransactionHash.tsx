/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { deleteCookie, getCookie } from '@/app/actions/cookie';
import { handleRevalidatePath, handleRevalidateTag } from '@/app/actions/revalidation';
import { boxRequest } from '@/app/http/requests/box';
import ABI from '@/contracts/BoxDistributor.json';
import { API_BNB_KEY, CONTRACT_ADDRESS } from '@/libs/shared/constants/globals';
import useBoxStore from '@/store/useBoxStore';
import { toast } from 'sonner';
import Web3 from 'web3';
import { useShallow } from 'zustand/react/shallow';

const etherUrl = 'https://api.etherscan.io/v2/api';
type Props = { address: string; currentBox: number; latestOpenedBox: number };

let web3Singleton: Web3 | null = null;
let contractSingleton: any | null = null;
function getWeb3AndContract() {
  if (!web3Singleton) {
    web3Singleton = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_BSC_RPC_URL!));
    contractSingleton = new web3Singleton.eth.Contract(ABI, CONTRACT_ADDRESS);
  }
  return { web3: web3Singleton!, contract: contractSingleton! };
}
const TransactionHash = ({ address, currentBox, latestOpenedBox }: Props) => {
  const router = useRouter();
  const isProcessing = useRef<boolean>(false);
  let intervalOpenBox: NodeJS.Timeout | null = null;
  const { setIstriggerLoading } = useBoxStore(
    useShallow(
      state => ({
        setIstriggerLoading: state.setIsTriggerLoading
      })
    ),
  );

  const getLatestOpenBoxTransaction = async () => {
    const openBoxMethodId = '0xc20897b5';

    try {
      const response = await fetch(
        `${etherUrl}?chainId=56&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=9999&sort=desc&apikey=${API_BNB_KEY}`
      );

      const data = await response.json();

      const openTransactionLength = data?.result?.filter((item: { methodId: string }) => item.methodId === openBoxMethodId).length;
      if (data.status === '1') {
        // Find the first transaction that matches openBox method
        for (const tx of data.result) {
          // Filter by contract address if specified
          if (CONTRACT_ADDRESS && tx.to?.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
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

  useEffect(() => {
    const handleBoxError = async () => {
      const isShouldRefetch = await getCookie('isShouldRefetch');

      try {
        const handleRetryOpenBox = async () => {
          const { contract } = getWeb3AndContract();

          const boxCount = await contract.methods.boxesOpened(address).call();

          if (Number(boxCount) === latestOpenedBox && !isShouldRefetch) {
            clearInterval(intervalOpenBox as unknown as number);
            return;
          }

          if (isProcessing.current) {
            return;
          }
          const openBoxHash = await getLatestOpenBoxTransaction();
          // console.log(Number(boxCount), currentBox, openBoxHash?.openTransactionLength, 'hehe');
          if (Number(boxCount) === currentBox && currentBox === openBoxHash?.openTransactionLength) {
            try {
              if (!openBoxHash || isProcessing.current) {
                return;
              }
              await boxRequest.boxOpen(openBoxHash.transactionHash);
              await Promise.allSettled([
                handleRevalidateTag('get-me'),
                handleRevalidatePath('/'),
              ]);
              isProcessing.current = true;
              toast.success('Mở box thành công!');
            } catch (error) {
              console.error('Error opening box:', error);
              toast.error('Mở box thất bại!, vui lòng liên hệ với admin');
            } finally {
              router.refresh();
              localStorage.removeItem('LoadingItem');
              setIstriggerLoading(true);
              clearInterval(intervalOpenBox as unknown as number);
              await deleteCookie('isShouldRefetch');
            }
          }
        };

        intervalOpenBox = setInterval(handleRetryOpenBox, 2000);
      } catch {
        toast.error('Có lỗi xảy ra trong quá trình kiểm tra giao dịch. Vui lòng liên hệ với admin nếu lỗi vẫn tiếp diễn.');
      }
    };
    handleBoxError();
    return () => {
      if (intervalOpenBox) {
        clearInterval(intervalOpenBox);
      }
    };
  }, []);

  return null;
};

export default TransactionHash;
