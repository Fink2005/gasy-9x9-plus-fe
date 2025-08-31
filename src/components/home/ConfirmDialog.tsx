'use client';

import GoodSign from '@/libs/shared/icons/GoodSign';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
// Minimal USDT ABI for approval
import { deleteCookie } from '@/app/actions/cookie';
import { handleRevalidatePath, handleRevalidateTag } from '@/app/actions/revalidation';
import { boxRequest } from '@/app/http/requests/box';
import { API_BNB_KEY, etherUrl } from '@/libs/shared/constants/globals';
import CoinIcon from '@/libs/shared/icons/Coin';
import { isClient } from '@/libs/utils';
import useBoxStore from '@/store/useBoxStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  boxNumber: number;
  currentBox: number;
  isOpenBox: boolean;
  address: string;
};

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const ConfirmDialog = ({ boxNumber, isOpenBox, currentBox, address }: Props) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loadingItemsStore, setLoadingItemsStore] = useState<boolean>(false);
  const { handleOpenBox, loadingItems, setLoading, clearBox } = useBoxStore(
    useShallow(
      state => ({
        loadingItems: state.loadingItems,
        handleOpenBox: state.handleOpenBox,
        setLoading: state.setLoading,
        clearBox: state.clearBox,
      })
    ),
  );
  const intervalOpenBox = useRef<NodeJS.Timeout | null>(null);
  const isProcessing = useRef<boolean>(false);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const getLatestOpenBoxTransaction = useCallback(
    async () => {
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
    },
    [address]
  );

  const handleBoxError = useCallback(async () => {
    const openBoxHash = await getLatestOpenBoxTransaction();
    if (isProcessing.current || openBoxHash?.openTransactionLength === (currentBox - 1)) {
      console.log('return ne em iu');
      return;
    }

    try {
      const handleRetryOpenBox = async () => {
        console.log((currentBox - 1), openBoxHash?.openTransactionLength);

        try {
          await boxRequest.boxOpen(openBoxHash?.transactionHash);
          isProcessing.current = true;
          await Promise.allSettled([
            handleRevalidateTag('get-me'),
            handleRevalidatePath('/'),
          ]);
          toast.success('Mở box thành công!');
        } catch (err) {
          console.warn(err);
          toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
        } finally {
          router.refresh();
          clearInterval(intervalOpenBox as unknown as number);
          await deleteCookie('boxData');
          setLoading(false, boxNumber as number);
          localStorage.removeItem('LoadingItem');
          clearBox();
        }
      };
      intervalOpenBox.current = setInterval(handleRetryOpenBox, 1000);
    } catch {
      toast.error('Có lỗi xảy ra trong quá trình kiểm tra giao dịch. Vui lòng liên hệ với admin nếu lỗi vẫn tiếp diễn.');
    }
  }, [clearBox, currentBox, getLatestOpenBoxTransaction, router, setLoading, boxNumber]);

  const handleOpenChange = async (open: boolean) => {
    if ((!isOpenBox && boxNumber !== 1) && currentBox !== boxNumber) {
      toast.warning(`Bạn cần phải mở hộp ${currentBox}`);
      return;
    } else if (isOpenBox) {
      router.push(`/box/${boxNumber}`);
      return;
    }
    setIsOpen(open);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1000);
  };

  const handleConfirm = async () => {
    const res = await handleOpenBox({
      currentBox: boxNumber,
      isConfirmed: true,
    });
    res && setIsSuccess(true);
  };

  useEffect(() => {
    if (isClient) {
      const LoadingItem = localStorage.getItem('LoadingItem') ? JSON.parse(localStorage.getItem('LoadingItem')!) : {};
      setLoadingItemsStore(LoadingItem[boxNumber] || false);
    }
  }, [boxNumber]);

  useEffect(() => {
    (async () => {
      await handleBoxError();
    })();
    return () => {
      clearInterval(intervalOpenBox.current as unknown as number);
    };
  }, [handleBoxError]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={`${(boxNumber === 1 || isOpenBox || currentBox === boxNumber) ? 'button-base' : 'button-base-disabled'} text-white !py-1 font-[700] text-[11px] text-nowrap w-20`}
      >
        { loadingItems[boxNumber] || loadingItemsStore ? <Loader2 className="animate-spin size-4" /> : !isOpenBox ? 'Mở khóa' : 'Chi tiết'}
      </DialogTrigger>
      <DialogContent className="confirm-dialog gap-3">
        <DialogHeader>
          <DialogTitle className="text-shadow-custom text-[1.5rem] font-[700] mb-0">
            {!isSuccess && 'Xác nhận thanh toán'}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {!isSuccess ? (
          // </div>
          <div className="-translate-y-3 flex flex-col items-center">
            <CoinIcon />
            <p className="text-shadow-custom text-[1.5rem] font-[860] text-center">26$ USDT</p>
            <p className="text-yellow-200 text-xs text-center mt-1">"Vui lòng không được thoát ứng dụng hoặc làm mới trang trong quá trình mở box"</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center -translate-y-3">
            <GoodSign />
            <p className="text-shadow-custom font-[700] text-[1.125rem]">Mở box thành công</p>
            <p className="text-shadow-custom text-[0.875rem] font-[400] text-center">
              Nhấn
              {' '}
              <span className="font-[700]">{`"Chi tiết box ${boxNumber}"`}</span>
              {' '}
              để bắt đầu hành trình gieo hạt của bạn
            </p>
          </div>
        )}

        <div className="space-x-3 px-3 flex w-full -translate-y-2">
          <Button
            variant="outline"
            className="bg-transparent text-white w-1/2"
            onClick={handleCancel}
          >
            Hủy bỏ
          </Button>
          <Button
            className="w-1/2 button-custom"
            onClick={() => {
              !isSuccess ? handleConfirm() : router.push(`box/${boxNumber}`);
            }}
            disabled={loadingItems[boxNumber] || loadingItemsStore}
          >
            { loadingItems[boxNumber] || loadingItemsStore ? 'Đang xử lý...' : isSuccess ? 'Chi tiết' : 'Xác nhận'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
