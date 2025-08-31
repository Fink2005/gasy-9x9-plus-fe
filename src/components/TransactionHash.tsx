/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import useGetCookie from '@/hooks/useGetCookie';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { deleteCookie } from '@/app/actions/cookie';
import { handleRevalidatePath, handleRevalidateTag } from '@/app/actions/revalidation';
import { boxRequest } from '@/app/http/requests/box';
import { API_BNB_KEY, CONTRACT_ADDRESS } from '@/libs/shared/constants/globals';
import useBoxStore from '@/store/useBoxStore';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

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
  let intervalOpenBox: NodeJS.Timeout | null = null;

  const { clearBox, setLoading } = useBoxStore(
    useShallow(
      state => ({
        currentBox: state.boxRetry.currentBox,
        clearBox: state.clearBox,
        setLoading: state.setLoading,

      })
    ),
  );

  const getLatestOpenBoxTransaction = async (address: string) => {
    const openBoxMethodId = '0xc20897b5';

    try {
      const response = await fetch(
        `${etherUrl}?chainId=56&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=200&sort=desc&apikey=${API_BNB_KEY}`
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
    let isProcessing = false;

    const handleBoxError = async (currentBox: number) => {
      const { userAddress: address } = await getAddress();
      console.log('chay r be oi');

      try {
        const handleRetryOpenBox = async () => {
          const openBoxHash = await getLatestOpenBoxTransaction(address);

          console.log(currentBox, openBoxHash?.openTransactionLength, 'hehe');

          if (currentBox === openBoxHash?.openTransactionLength) {
            clearInterval(intervalOpenBox as unknown as number);
            if (isProcessing) {
              return;
            }
            try {
              if (!openBoxHash) {
                return;
              }
              await boxRequest.boxOpen(openBoxHash.transactionHash);
              isProcessing = true;
              await Promise.allSettled([
                handleRevalidateTag('get-me'),
                handleRevalidatePath('/'),
              ]);
              toast.success('Mở box thành công!');
            } finally {
              router.refresh();
              clearInterval(intervalOpenBox as unknown as number);
              clearBox();
              setLoading(false, (currentBox) as number);
              await deleteCookie('boxData');
              localStorage.removeItem('LoadingItem');
              // window.location.reload();
            }
          }
        };
        intervalOpenBox = setInterval(handleRetryOpenBox, 2000);
      } catch {
        toast.error('Có lỗi xảy ra trong quá trình kiểm tra giao dịch. Vui lòng liên hệ với admin nếu lỗi vẫn tiếp diễn.');
      }
    };
    // handleBoxError(1);

    handleGetCookie('boxData').then(async (result) => {
      if (result) {
        const { isConfirmed, currentBox } = result as { isConfirmed: boolean; currentBox: number };
        if (isConfirmed) {
          handleBoxError(currentBox);
        }
      }
    });

    return () => {
      if (intervalOpenBox) {
        clearInterval(intervalOpenBox);
      }
    };
  }, [pathname, router]);

  return null;
};

export default TransactionHash;
