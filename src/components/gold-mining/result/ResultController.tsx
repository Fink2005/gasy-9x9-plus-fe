'use client';
import { deleteCookie } from '@/app/actions/cookie';
import { Button } from '@/components/ui/button';
import GamePad2 from '@/libs/shared/icons/GamePad2';
import { redirect } from 'next/navigation';

const ResultController = () => {
  const handleSubmit = async () => {
    await deleteCookie('goldMiningScore');
    redirect('/gold-mining');
  };
  return (
    <div className="w-full flex flex-col items-center space-y-3 fixed bottom-20">
      <Button
        className="button-base items-center max-w-[21.4375rem] w-full"
        onClick={handleSubmit}
      >
        <GamePad2 />
        <span>
          Chơi lại (còn 8/9)
        </span>

      </Button>
    </div>
  );
};

export default ResultController;
