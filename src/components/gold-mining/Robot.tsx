import HookBaseIcon from '@/libs/shared/icons/HookBase';
import Image from 'next/image';

export const Robot = () => {
  return (
    <div className="absolute top-20">
      <Image
        src="/assets/mining-robot.webp"
        width={107}
        height={96}
        alt="robot mining"
        className="w-[6.6875rem] h-[6rem]"
      />
      <div className="absolute left-1/2 -translate-x-1/2 top-20">
        <HookBaseIcon />
      </div>
    </div>
  );
};
