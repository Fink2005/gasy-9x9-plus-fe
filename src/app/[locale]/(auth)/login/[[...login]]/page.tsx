import SafePal from '@/components/wallet/SafePal';
import Image from 'next/image';

const login = () => {
  return (
    <div className="flex flex-col items-center relative pt-20">
      <>
        <div className="flex">
          <Image src="/assets/robot.webp" quality="100" width="300" height="300" className="robot-login animateLand" alt="robot" />
          <Image src="/assets/logo-9x9.png" quality="100" width="300" height="300" className="robot-login !w-[200px] !h-[130px] " alt="logo 9x9" />
        </div>
        <div className="bg-login-card">
          <p className="text-white text-[1.375rem]">Kết nối để bắt đầu hành trình</p>
          <SafePal />
        </div>
      </>
    </div>
  );
};

export default login;
