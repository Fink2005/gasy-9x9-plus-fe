import Profile from '@/app/[locale]/(main)/(root)/(base-without-footer)/profile/Profile';
import Loading from '@/app/[locale]/loading';
import PreviousNavigation from '@/components/PreviousNavigation';
import ConnectionIcon from '@/libs/shared/icons/Connection';
import TelegramIcon from '@/libs/shared/icons/Telegram';
import { Suspense } from 'react';

const page = async () => {
  return (
    <div className="bg-9x9 min-h-screen px-4">
      <div className="absolute left-1/2 -translate-1/2 w-full mt-6">
        <PreviousNavigation />
        <h1 className="text-shadow-custom text-center font-[590] text-[1.25rem]">Profile</h1>
      </div>
      <Suspense fallback={<Loading />}>
        <Profile />
      </Suspense>
      <button type="button" className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4 w-full">
        <ConnectionIcon />
        <p className="text-shadow-custom">Chia sẻ hành trình của bạn</p>
      </button>
      <div className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4 space-x-2">
        <TelegramIcon className="ms-4" />
        <p className="text-shadow-custom">Tổng đài</p>
      </div>
    </div>
  );
};

export default page;
