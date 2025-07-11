'use client';
import { deleteCookie } from '@/app/actions/cookie';
import { Button } from '@/components/ui/button';
import CopyIcon from '@/libs/shared/icons/Copy';
import GamePad2 from '@/libs/shared/icons/GamePad2';
import { redirect } from 'next/navigation';

const ResultController = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-3 absolute bottom-20">
      <Button
        className="button-base items-center max-w-[21.4375rem] w-full"
        onClick={async () => {
          await deleteCookie('goldMiningScore');
          redirect('/gold-mining');
        }}
      >
        <GamePad2 />
        <span>
          Chơi lại (còn 8/9)
        </span>
      </Button>
      <Button className="button-base-2 items-center max-w-[21.4375rem] w-full mb-8">
        <CopyIcon className="translate-y-[6px] size-14" />
        <span>
          Chia sẻ với bạn bè
        </span>
      </Button>
    </div>
  );
};

export default ResultController;
