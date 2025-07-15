'use client';
import { createCookie } from '@/app/actions/cookie';
import { goldMiningRequest } from '@/app/apis/requests/goldMining';
import { Button } from '@/components/ui/button';
import GamePad2 from '@/libs/shared/icons/GamePad2';
import QuestionCircleIcon from '@/libs/shared/icons/QuestionCircle';
import UnknowAvatarIcon from '@/libs/shared/icons/UnknowAvatar';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  address: string | undefined;
};

const GoldMining = ({ address }: Props) => {
  const [isDisplayQuestion, setIsDisplayQuestion] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter();
  const handlePlayGame = async () => {
    setisLoading(true);
    try {
      const result = await goldMiningRequest.GoldMiningStart();
      const sessionId = result?.sessionId || '';
      createCookie({
        name: 'sessionId',
        value: sessionId || '',
      });
      router.push('/gold-mining/game');
    } finally {
      setisLoading(false);
    }
  };
  return (
    <>
      <div className="flex space-x-2 z-10">
        <Button className="button-base " onClick={handlePlayGame}>
          {isLoading ? <Loader2 className="animate-spin w-40" />
            : (
                <>
                  <GamePad2 />
                  <span className="-translate-x-2">
                    Chơi game 9/10
                  </span>
                </>
              )}
        </Button>
        <Button className="button-base !p-0" onClick={() => setIsDisplayQuestion(!isDisplayQuestion)}>
          <QuestionCircleIcon />
        </Button>
      </div>
      {isDisplayQuestion && (
        <div className="question-card max-w-[21.4375rem] w-full mt-[1rem] z-10">
          <div>
            <QuestionCircleIcon />
          </div>
          <p className="text-shadow-custom text-[0.875rem] font-[590]">Một ngày chỉ chơi tối đa 10 lượt chơi. Khi bạn mời được 1 người chơi bạn sẽ được 1 lượt chơi.</p>
        </div>
      )}

      <div className="user-card flex justify-around items-center size-full max-w-[21.4375rem] w-full mt-[1rem] z-10">
        <div className="flex items-center">
          <span className="text-shadow-custom font-[500] text-[1rem]">
            4
          </span>
          <UnknowAvatarIcon className="size-12" />
        </div>
        <span className="text-shadow-custom text-[1rem] font-[400]">
          {`${address?.slice(0, 8)}...${address?.slice(-3)}`}
        </span>
        <div className="flex items-center">
          <span className="text-shadow-custom text-[0.875rem] font-[590]">
            7000
          </span>
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
