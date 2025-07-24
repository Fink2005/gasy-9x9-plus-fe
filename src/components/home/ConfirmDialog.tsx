'use client';

import CoinIcon from '@/libs/shared/icons/Coin';
import GoodSign from '@/libs/shared/icons/GoodSign';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Web3 from 'web3';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

// Minimal USDT ABI for approval
const usdtAbi = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
];

// Constants
// const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const usdtAddress = '0xc45D0156553e000eBcdFc05B08Ea5184911e13De'; // this is for Sepolia testnet USDT
const spenderAddress = '0x562Ae2ED39cb2bA9d03268B83EE88504e9675f03';
const approveAmount = 26 * 10 ** 6; // 26 USDT (6 decimals)

const ConfirmDialog = () => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleConfirm = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Vui lòng cài đặt ví');
      return;
    }

    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 = Sepolia chain ID in hex
      });
      // await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];

      const usdtContract = new web3.eth.Contract(usdtAbi as any, usdtAddress);

      if (usdtContract.methods.approve) {
        await usdtContract.methods.approve(spenderAddress, approveAmount).send({ from: sender });
      } else {
        throw new Error('approve method is undefined on the contract');
      }

      setIsConfirm(true);
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Giao dịch thất bại hoặc bị huỷ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="button-base text-white !py-1 font-[700] text-[11px]">Mở khóa</DialogTrigger>
      <DialogContent className="confirm-dialog gap-3">
        <DialogHeader>
          <DialogTitle className="text-shadow-custom text-[1.5rem] font-[700] mb-0">
            {!isConfirm && 'Xác nhận thanh toán'}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {!isConfirm ? (
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
              <span className="font-[700]">"Chi tiết box 1"</span>
              {' '}
              để bắt đầu hành trình gieo hạt của bạn
            </p>
          </div>
        )}

        <div className="space-x-3 px-3 flex w-full -translate-y-2">
          <DialogClose asChild>
            <Button variant="outline" className="bg-transparent text-white w-1/2">Hủy bỏ</Button>
          </DialogClose>
          <Button
            className="w-1/2 button-custom"
            onClick={() => {
              !isConfirm ? handleConfirm() : router.push('box/123');
            }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : isConfirm ? 'Chi tiết' : 'Xác nhận'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
