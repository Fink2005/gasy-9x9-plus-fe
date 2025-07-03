import LeftArrowIcon from '@/libs/shared/icons/LeftArrow';
import Image from 'next/image';

const page = () => {
  return (
    <div className="min-h-screen bg-numberology flex flex-col items-center pt-2">
      <LeftArrowIcon className="absolute left-4" />
      <h1 className="text-shadow-custom text-[1.25rem] font-[590]">Khám phá bản thân</h1>
      <p className="text-shadow-custom text-[0.75rem] font-[400]">Hiểu bản thân để sống đúng với bản thân</p>
      <Image width="600" height="600" className="w-[250px] h-[160]" alt="logo" src="/assets/logo-9x9.png" />
      <div>
        <Image width="500" height="500" className="" alt="logo" src="/assets/numberology-circle.png" />

      </div>

    </div>
  );
};

export default page;
