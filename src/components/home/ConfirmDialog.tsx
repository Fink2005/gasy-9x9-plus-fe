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
import CoinIcon from '@/libs/shared/icons/Coin';
import { isClient } from '@/libs/utils';
import useBoxStore from '@/store/useBoxStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  boxNumber: number;
  currentBox: number;
  isOpenedBox: boolean;
  address: string;
};

const ConfirmDialog = ({ boxNumber, isOpenedBox, currentBox, address }: Props) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loadingItemsStore, setLoadingItemsStore] = useState<boolean>(false);
  const { handleOpenBox, loadingItems, isTriggerLoading } = useBoxStore(
    useShallow(
      state => ({
        loadingItems: state.loadingItems,
        isTriggerLoading: state.isTriggerLoading,
        handleOpenBox: state.handleOpenBox,
        setLoading: state.setLoading,
      })
    ),
  );

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    if ((!isOpenedBox && boxNumber !== 1) && currentBox !== boxNumber) {
      toast.warning(`Bạn cần phải box ${currentBox}`);
      return;
    } else if (isOpenedBox) {
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
    const res = await handleOpenBox(
      boxNumber,
      address
    );
    res && setIsSuccess(true);
  };

  useEffect(() => {
    if (isClient) {
      const LoadingItem = localStorage.getItem('LoadingItem') ? JSON.parse(localStorage.getItem('LoadingItem')!) : false;
      setLoadingItemsStore(LoadingItem ? LoadingItem[boxNumber] : false);
    }
  }, [boxNumber, isTriggerLoading]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={`${(boxNumber === 1 || isOpenedBox || currentBox === boxNumber) ? 'button-base' : 'button-base-disabled'} text-white !py-1 font-[700] text-[11px] text-nowrap w-20`}
      >
        { loadingItems[boxNumber] || loadingItemsStore ? <Loader2 className="animate-spin size-4" /> : !isOpenedBox ? 'Mở khóa' : 'Chi tiết'}
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
            className={`bg-transparent text-white w-1/2 ${loadingItems[boxNumber] || loadingItemsStore ? 'hidden' : ''}`}
            onClick={handleCancel}
          >
            Quay lại
          </Button>
          <Button
            className={`${loadingItems[boxNumber] || loadingItemsStore ? 'w-full' : 'w-1/2'} transition-all button-custom`}
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
