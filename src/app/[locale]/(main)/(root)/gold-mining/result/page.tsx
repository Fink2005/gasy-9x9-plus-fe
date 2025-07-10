import { getCookie } from '@/app/actions/cookie';
import ResultController from '@/components/gold-mining/result/ResultController';
import Image from 'next/image';

const page = async () => {
  const score = await getCookie('goldMiningScore');
  return (
    <div className="bg-gold-mining-game min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-shadow-custom text-[3.25rem] font-[860]">{score}</h1>
      <div className="flex items-center space-x-2">
        <Image className="w-[1.5rem] h-[1.75rem] ms-3" src="/assets/badge-medal.png" width={100} height={100} alt="badge medal" />
        <p className="text-shadow-custom text-[1rem] font-[700]">
          {' '}
          số điểm nhận được
        </p>
      </div>
      <ResultController />
    </div>
  );
};

export default page;
