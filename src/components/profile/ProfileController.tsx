'use client';
import ConnectionIcon from '@/libs/shared/icons/Connection';
import TelegramIcon from '@/libs/shared/icons/Telegram';
import { handleClipboardCopy } from '@/libs/utils';
import Link from 'next/link';

const ProfileController = ({ address }: { address: string }) => {
  return (
    <>
      <button type="button" className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4 w-full" onClick={() => handleClipboardCopy(address || '')}>
        <ConnectionIcon />
        <p className="text-shadow-custom">Chia sẻ hành trình của bạn</p>
      </button>
      <Link href="https://t.me/+WrtBnbRub-k5ZWM1" target="_blank" className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4 space-x-2">
        <TelegramIcon className="ms-4" />
        <p className="text-shadow-custom">Liên hệ</p>
      </Link>
    </>
  );
};

export default ProfileController;
