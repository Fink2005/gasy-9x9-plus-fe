import BronzeMedalIcon from '@/libs/shared/icons/BronzeMedal';
import GoldMedalIcon from '@/libs/shared/icons/GoldMedal';
import SilverMedalIcon from '@/libs/shared/icons/SilverMedal';
import UnknowAvatarIcon from '@/libs/shared/icons/UnknowAvatar';
import Image from 'next/image';

type Player = {
  id: number;
  address: string;
  points: number;
  rank: number;
};
const mockData: Player[] = [
  { id: 1, address: '0xB3b531...451b', points: 10000, rank: 1 },
  { id: 2, address: '0xB3b531...321a', points: 9000, rank: 2 },
  { id: 3, address: '0xB3b531...45Aa', points: 8000, rank: 3 },
  { id: 4, address: '0xB3b531...45Aa', points: 7000, rank: 4 },
  { id: 5, address: '0xB3b531...45Aa', points: 7000, rank: 5 },
  { id: 6, address: '0xB3b531...45Aa', points: 7000, rank: 6 },
  { id: 7, address: '0xB3b531...45Aa', points: 7000, rank: 7 },
  { id: 8, address: '0xB3b531...45Aa', points: 7000, rank: 8 },
  { id: 9, address: '0xB3b531...45Aa', points: 7000, rank: 9 },
  { id: 10, address: '0xB3b531...45Aa', points: 7000, rank: 10 },
  { id: 11, address: '0xB3b531...45Aa', points: 7000, rank: 11 },
  { id: 12, address: '0xB3b531...45Aa', points: 7000, rank: 12 },
  { id: 13, address: '0xB3b531...45Aa', points: 7000, rank: 13 },
  { id: 14, address: '0xB3b531...45Aa', points: 7000, rank: 14 },
  { id: 15, address: '0xB3b531...45Aa', points: 7000, rank: 15 },
  { id: 16, address: '0xB3b531...45Aa', points: 7000, rank: 16 },
  { id: 17, address: '0xB3b531...45Aa', points: 7000, rank: 17 },
  { id: 18, address: '0xB3b531...45Aa', points: 7000, rank: 18 },
  { id: 19, address: '0xB3b531...45Aa', points: 7000, rank: 19 },
  { id: 20, address: '0xB3b531...45Aa', points: 7000, rank: 20 },
];

const top3Ranking = [
  <GoldMedalIcon key="gold-medal" />,
  <SilverMedalIcon key="silver-medal" />,
  <BronzeMedalIcon key="bronze-medal" />
];
//

const RankingList = () => {
  return (
    <div className="mt-[1rem] w-full overflow-y-auto h-[calc(100vh-11rem)] relative">
      <div className="flex flex-col justify-center px-5 w-full space-y-[0.88rem] absolute top-0">
        {
          mockData.length > 0 && mockData.map((player, index) => (
            <div key={player.id} className={`ranking-list-items flex items-center justify-around ${(mockData.length - 1) === index ? 'mb-4' : ''}`}>
              <div className={`flex items-center ${player.rank <= 3 ? '' : 'translate-x-[2px] space-x-2'} `}>
                <span className="text-shadow-custom font-[500] text-[1rem]">
                  {player.rank <= 3 ? top3Ranking[player.rank - 1] : player.rank}
                </span>
                <UnknowAvatarIcon className="size-12" />
              </div>
              <span className="text-shadow-custom text-[1rem] font-[400]">{player.address}</span>
              <div className="flex items-center">
                <span className="text-shadow-custom text-[0.875rem] font-[590]">
                  {player.points.toLocaleString()}
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
          ))
        }
      </div>

    </div>
  );
};

export default RankingList;
