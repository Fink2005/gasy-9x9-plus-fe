'use client';
import type { NumerologyResponse } from '@/types/numberology';
import Image from 'next/image';

type Props = {
  baseUrl: string;
  numerologyResult: NumerologyResponse | null;
};

const StarChart = ({ baseUrl, numerologyResult }: Props) => {
  const handleNavigation = (meaning: string) => {
    window.location.href = `${baseUrl}&meaning=${meaning}`;
  };

  return (
    <div className="relative min-h-[370px] min-w-[440px] max-w-[450px] w-full">
      <Image width={500} height={500} alt="aura" src="/assets/aura-circle.webp" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[49%] z-0" />
      <Image width={500} height={500} alt="star chart" src="/assets/star-chart.webp" className="size-[10rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Destiny */}
      <button type="button" onClick={() => handleNavigation('destiny')} className="flex flex-col items-center absolute -top-5 left-35">
        <p className="text-shadow-custom text-medium-custom-2">SỨ MỆNH</p>
        <Image width={62} height={62} alt="destiny" src="/assets/destiny.png" className="size-auto" />
      </button>

      {/* Life Path */}
      <button type="button" onClick={() => handleNavigation('lifePath')} className="flex flex-col items-center right-[49px] absolute top-10">
        <p className="text-shadow-custom text-medium-custom text-medium-custom-2">ĐƯỜNG ĐỜI</p>
        <Image width={62} height={62} alt="life path" src="/assets/life-path.png" className="size-auto" />
      </button>

      {/* Personality */}
      <button type="button" onClick={() => handleNavigation('personality')} className="flex flex-col items-center left-8 absolute top-27">
        <p className="text-shadow-custom text-medium-custom-2">TÍNH CÁCH</p>
        <Image width={62} height={62} alt="life path" src="/assets/personality.png" className="size-auto" />
      </button>

      {/* Soul */}
      <button type="button" onClick={() => handleNavigation('soul')} className="flex flex-col items-center left-34 absolute bottom-0">
        <Image width={62} height={62} alt="life path" src="/assets/soul.png" className="size-auto" />
        <p className="text-shadow-custom text-medium-custom-2">TÂM HỒN</p>
      </button>

      {/* Physical */}
      <button type="button" onClick={() => handleNavigation('body')} className="flex flex-col items-center absolute right-15 bottom-12">
        <Image width={62} height={62} alt="life path" src="/assets/physical.png" className="size-auto" />
        <p className="text-shadow-custom text-medium-custom-2">THỂ CHẤT</p>
      </button>

      <p className="absolute top-1/2 left-1/2 -translate-1/2 text-shadow-custom font-[590] text-[4.5rem]">
        {numerologyResult && numerologyResult.number}
      </p>
    </div>
  );
};

export default StarChart;
