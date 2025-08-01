import Loading from '@/app/[locale]/loading';
import { Button } from '@/components/ui/button';
import SafePal from '@/components/wallet/SafePal';
import Image from 'next/image';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{ invitedBy: string | null }>;
};
const login = async ({ searchParams }: Props) => {
  const { invitedBy } = await searchParams;
  return (
    <div className="flex flex-col items-center relative pt-20">
      <>
        <div className="flex">
          <Image src="/assets/robot.webp" quality="100" width="300" height="300" className="robot-login animateLand" alt="robot" />
          <Image src="/assets/logo-9x9.png" quality="100" width="300" height="300" className="robot-login !w-[200px] !h-[130px] " alt="logo 9x9" />
        </div>
        <div className="bg-login-card w-full">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4EC1FF]  text-[1.375rem] font-[510] text-nowrap">Kết nối để bắt đầu hành trình</p>
          <Suspense fallback={<Loading />}>
            <SafePal invitedBy={invitedBy} />
          </Suspense>
        </div>
        { invitedBy && (
          <div className="bg-login-card mt-5 w-full space-y-[0.5rem]">
            <p className="text-white text-[1.375rem] font-[510] text-center">Người mời</p>
            <Button className="button-login w-full">
              {' '}
              {`${invitedBy?.slice(0, 26)}...${invitedBy?.slice(-3)}`}
            </Button>
          </div>
        )}
      </>
    </div>
  );
};

export default login;
