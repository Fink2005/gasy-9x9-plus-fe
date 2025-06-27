import { SafePal } from '@/components/wallet/SafePal';
import Image from 'next/image';

const login = () => {
  return (
    <div className=" flex flex-col items-center relative">
      <>
        <Image src="/assets/robot.png" width="300" height="300" className="robot-login" alt="robot" />
        <div className="bg-login-card">
          <p className="text-white text-[1.375rem] ">Kết nối để bắt đầu hành trình</p>
          <SafePal type="large" />
        </div>
      </>
    </div>
  );
};

export default login;
