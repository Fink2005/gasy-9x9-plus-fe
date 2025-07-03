import { montserrat } from '@/app/fonts/montserrat';
import IntroductionList from '@/components/introduction/IntroductionList';
import Image from 'next/image';

const page = () => {
  return (
    <div className="flex flex-col items-center">
      <Image width="500" height="500" className="w-[200px] h-[130px]" alt="logo" src="/assets/logo-9x9.png" />
      <h1 className={`${montserrat.variable} title-introduction`}>GIỚI THIỆU VÀ ĐỊNH HƯỚNG</h1>
      <IntroductionList />
    </div>
  );
};

export default page;
