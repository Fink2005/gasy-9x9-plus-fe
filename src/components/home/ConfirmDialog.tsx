'use client';

import CoinIcon from '@/libs/shared/icons/Coin';
import GoodSign from '@/libs/shared/icons/GoodSign';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const ConfirmDialog = () => {
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const handleConfirm = () => {
    setIsConfirm(true);
  };

  return (
    <Dialog>
      <DialogTrigger className="button-base text-white !py-1 font-[700] text-[11px]">
        Mở khóa
      </DialogTrigger>
      <DialogContent className="confirm-dialog gap-3">
        <DialogHeader>
          <DialogTitle className="text-shadow-custom text-[1.5rem] font-[700] mb-0">{!isConfirm && 'Xác nhận thanh toán'}</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        { !isConfirm ? (
          <div className="-translate-y-3">
            <CoinIcon />
            <p className="text-shadow-custom text-[1.5rem] font-[860] text-center">26$ USDT</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center -translate-y-3">
            <GoodSign />
            <p className="text-shadow-custom font-[700] text-[1.125rem]">Mở box thành công</p>
            <p className="text-shadow-custom text-[0.875rem] font-[400] text-center">
              Nhấn
              {' '}
              <span className="font-[700]">
                "Chi tiết box 1"
              </span>
              {' '}
              để bắt đầu hành trình
              <br className="sm:hidden " />
              {' '}
              gieo hạt của bạn
            </p>
          </div>
        )}
        <div className="space-x-3 px-3 flex w-full -translate-y-2">
          <DialogClose asChild>
            <Button variant="outline" className="bg-transparent text-white w-1/2">Hủy bỏ</Button>
          </DialogClose>
          <Button type="submit" className="w-1/2 button-custom" onClick={handleConfirm}>{isConfirm ? 'Chi tiết' : 'Xác nhận'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
