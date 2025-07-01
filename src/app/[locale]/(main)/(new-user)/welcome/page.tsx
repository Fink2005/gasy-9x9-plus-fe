import { montserrat } from '@/app/fonts/montserrat';
import WelcomeFooter from '@/components/welcome/WelcomeFooter';
import WelcomeList1 from '@/components/welcome/WelcomeList1';
import WelcomeList2 from '@/components/welcome/WelcomeList2';
import WelcomeList3 from '@/components/welcome/WelcomeList3';
import WelcomeList4 from '@/components/welcome/WelcomeList4';
import WelcomeList5 from '@/components/welcome/WelcomeList5';
import Image from 'next/image';

const page = () => {
  return (
    <div className="flex flex-col items-center ">
      <Image width="500" height="500" className="w-[200px] h-[130px]" alt="logo" src="/assets/logo-9x9.png" />
      <div className="title-welcome flex flex-col">
        <h1 className={`${montserrat.variable} w-[19rem] text-title-welcome`}>HÀNH TRÌNH LAN TOẢ GIÁ TRỊ BẮT ĐẦU TỪ ĐÂY</h1>
      </div>
      <p className="subtitle-welcome pt-[0.75rem]">Tấm vé mở ra hành trình kết nối thịnh vượng toàn cầu</p>
      <div className="layout-welcome-list">
        <div className="welcome-list-items space-y-[0.38rem]">
          <WelcomeList1 />
          <WelcomeList2 />
          <WelcomeList3 />
          <WelcomeList4 />
          <WelcomeList5 />
          <p className="pt-[0.62rem] text-nowrap">Với mỗi bước tiến của bạn - cả hệ thống sẽ cùng tiến bước.</p>
        </div>
        <WelcomeFooter />
      </div>
    </div>
  );
};

export default page;
