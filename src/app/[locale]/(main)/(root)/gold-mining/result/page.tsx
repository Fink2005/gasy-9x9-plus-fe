'use client';
import ResultController from '@/components/gold-mining/result/ResultController';
import inspirationData from '@/libs/jsons/inspiration.json';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ResultMiningGold = () => {
  const score = (typeof window !== 'undefined' && localStorage.getItem('goldMiningScore')) || '';
  const inspirationNumber = (typeof window !== 'undefined' && localStorage.getItem('inspiration')) || '';
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchInspiration = async () => {
      const res = inspirationData.find(item => item.id === Number(inspirationNumber));
      setData(res?.content);
    };
    fetchInspiration();
  }, [inspirationNumber]);

  return (
    <div className="bg-gold-mining-game min-h-screen flex flex-col items-center pt-40 px-4">
      <h1 className="text-shadow-custom text-[3.25rem] font-[860]">{score}</h1>
      <div className="flex items-center space-x-2">
        <Image className="w-[1.5rem] h-[1.75rem] ms-3" src="/assets/badge-medal.png" width={100} height={100} alt="badge medal" />
        <p className="text-shadow-custom text-[1rem] font-[700]">
          {' '}
          số điểm nhận được
        </p>
      </div>
      <Image width="500" height="500" className="w-[200px] h-[130px]" alt="logo" src="/assets/logo-9x9.png" />
      <p className="text-shadow-custom text-center">{data}</p>
      <ResultController score={Number(score || 0)} />
    </div>
  );
};

export default ResultMiningGold;
