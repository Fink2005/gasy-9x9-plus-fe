'use client';
import { deleteCookie, getCookie } from '@/app/actions/cookie';
import { goldMiningRequest } from '@/app/apis/requests/goldMining';
import { Button } from '@/components/ui/button';
import GamePad2 from '@/libs/shared/icons/GamePad2';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';

type Props = {
  score: number;
};
const ResultController = ({ score }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    const sessionId = await getCookie('sessionId');
    try {
      setIsLoading(true);
      await goldMiningRequest.GoldMiningResult(sessionId || '', Number(score) || 0);
      await deleteCookie('goldMiningScore');
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
      redirect('/gold-mining');
    }
  };
  return (
    <div className="w-full flex flex-col items-center space-y-3 absolute bottom-30">
      <Button
        className="button-base items-center max-w-[21.4375rem] w-full"
        onClick={handleSubmit}
      >
        {
          isLoading ? <Loader2 className="animate-spin" />
            : (
                <>
                  <GamePad2 />
                  <span>
                    Chơi lại (còn 8/9)
                  </span>
                </>
              )
        }
      </Button>
    </div>
  );
};

export default ResultController;
