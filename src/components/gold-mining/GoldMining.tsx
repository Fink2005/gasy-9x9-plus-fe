'use client';

import { createCookie } from '@/app/actions/cookie';
import { useGetRestTime } from '@/app/http/queries/useGame';
import { useGetMe } from '@/app/http/queries/useMe';
import { goldMiningRequest } from '@/app/http/requests/goldMining';
import { Button } from '@/components/ui/button';
import GamePad2 from '@/libs/shared/icons/GamePad2';
import QuestionCircleIcon from '@/libs/shared/icons/QuestionCircle';
import UnknowAvatarIcon from '@/libs/shared/icons/UnknowAvatar';
import { formatAddress, formatMsToCountdown } from '@/libs/utils';
import type { GoldMiningRestTimesResponse } from '@/types/game';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';

import { useEffect, useState } from 'react';

const GoldMining = () => {
  const [isDisplayQuestion, setIsDisplayQuestion] = useState(false);
  const [dataRestTimes, setDataRestTimes] = useState<GoldMiningRestTimesResponse>({
    restTimes: 0,
    totalTimes: 9,
    timeRestore: 0,
    lastUpdatedTime: '',
  });
  const router = useRouter();

  const { data, isSuccess, isLoading, refetch, isFetching } = useGetRestTime();
  useEffect(() => {
    if (isSuccess && data) {
      setDataRestTimes(data);
    }
  }, [isSuccess, data]);
  const { data: dataMe, isSuccess: isDataMeSuccess } = useGetMe();

  const handlePlayGame = async () => {
    const result = await goldMiningRequest.GoldMiningStart();
    const sessionId = result?.sessionId || '';
    createCookie({
      name: 'sessionId',
      value: sessionId,
    });
    createCookie({
      name: 'playLeft',
      value: (dataRestTimes.restTimes - 1).toString(),
    });
    router.push('/gold-mining/game');
  };

  useEffect(() => {
    if (dataRestTimes.restTimes > 0 || dataRestTimes.timeRestore <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setDataRestTimes((prev) => {
        const nextTime = prev.timeRestore - 1000;
        if (nextTime <= 0) {
          clearInterval(timer);
          refetch();
          return {
            ...prev,
            timeRestore: 0,
          };
        }

        return {
          ...prev,
          timeRestore: nextTime,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dataRestTimes.restTimes, dataRestTimes.timeRestore, refetch]);
  return (
    <>
      <div className="flex space-x-2 z-10">
        <Button
          className="button-base !min-w-[200px] max-w-[200px]  disabled:opacity-80"
          onClick={handlePlayGame}
          disabled={dataRestTimes.restTimes <= 0 || isLoading}
        >
          {isLoading || isFetching ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : dataRestTimes.restTimes > 0 ? (
            <>
              <GamePad2 />
              <span className="-translate-x-2">
                Chơi game
                {' '}
                {dataRestTimes.restTimes}
                /
                {dataRestTimes.totalTimes}
              </span>
            </>
          ) : (
            <span className="text-shadow-cusstom font-[590] text-[0.8125rem]">
              Chờ tới lần chơi sau
              {' '}
              {formatMsToCountdown(dataRestTimes.timeRestore)}
            </span>
          )}
        </Button>

        <Button
          className="button-base !p-0"
          onClick={() => setIsDisplayQuestion(!isDisplayQuestion)}
        >
          <QuestionCircleIcon />
        </Button>
      </div>

      {isDisplayQuestion && (
        <div className="question-card mt-[1rem] z-10 max-w-[360px] w-full">
          <QuestionCircleIcon className="w-30" />
          <p className="text-shadow-custom text-[0.875rem] font-[510]">
            Mỗi người bạn mời sẽ giúp bạn mở thêm 1 cánh cửa khám phá bản thân. Càng mời nhiều, cơ hội nhận hộp quà lan tỏa càng lớn.
          </p>
        </div>
      )}

      <div className="user-card flex justify-around items-center max-w-[360px] w-full mt-[1rem] z-10">
        <div className="flex items-center">
          <span className="text-shadow-custom font-[500] text-[1rem]">{!dataMe?.score ? '999+' : dataMe?.rank}</span>
          <UnknowAvatarIcon className="size-12" />
        </div>
        <span className="text-shadow-custom text-[1rem] font-[400]">
          {isDataMeSuccess ? `${formatAddress(dataMe?.address || '0', 8)}` : 'Không có địa chỉ'}
        </span>
        <div className="flex items-center">
          <span className="text-shadow-custom text-[0.875rem] font-[590]">{dataMe?.score}</span>
          <Image
            src="/assets/badge-medal.png"
            alt="Badge Medal"
            width={24}
            height={24}
            className="inline-block ml-1"
          />
        </div>
      </div>
    </>
  );
};

export default GoldMining;
