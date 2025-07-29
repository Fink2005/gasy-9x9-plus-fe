/* eslint-disable react/no-array-index-key */
import GamePad3Icon from '@/libs/shared/icons/GamePad3';
import MultipleUserIcon from '@/libs/shared/icons/MultipleUser';
import ShareIcon from '@/libs/shared/icons/Share';
import WatchIcon from '@/libs/shared/icons/Watch';
import Image from 'next/image';

const data = [
  {
    title: 'Đào đủ 9 lượt/ngày',
    describe: 'Hoàn thành 1 vòng đào vàng trong ngày - 6/9',
    icon: <GamePad3Icon />,
    score: '+9'
  },
  {
    title: 'Chơi liên tục 3 ngày',
    describe: 'Không bỏ ngày nào - 3/3',
    icon: <GamePad3Icon />,
    score: '+99'
  },
  {
    title: 'Chơi liên tục 21 ngày',
    describe: 'Xây dựng thói quen 21 ngày - 3/21',
    icon: <GamePad3Icon />,
    score: '+299'
  },
  {
    title: 'Chơi liên tục 30 ngày',
    describe: 'Bền bỉ mỗi ngày - 3/30',
    icon: <GamePad3Icon />,
    score: '+999'
  },
  {
    title: 'Mời người chơi mới',
    describe: (
      <ul className="list-none p-0 m-0">
        <li>Mời được 1 người</li>
        <li>Mời được 1/9 người</li>
        <li>Mời được 1/99 người</li>
      </ul>
    ),
    type: 'list',
    icon: <ShareIcon />,
    score: ['+99', '+999', '+9999']
  },
  {
    title: 'Like video',
    describe: 'Like video trên nền tảng MXH',
    icon: <WatchIcon />,
    score: '+99'
  },
  {
    title: 'Tham gia group',
    describe: 'Tham gia cộng đồng 9x9 plus',
    icon: <MultipleUserIcon />,
    score: '+999'
  },
];

const Page = () => {
  return (
    <div className="bg-9x9 min-h-screen flex flex-col items-center text-center p-4 text-white">
      <h1 className="font-light text-xl text-blue-200 mb-2">9x9Plus</h1>
      <h2 className="font-semibold text-base mb-6 drop-shadow-lg">Nhiệm vụ</h2>

      <div className="w-full max-w-md h-[calc(100vh-150px)] overflow-y-auto">
        {data.map((item, index) => (
          <div className="bg-white/10 backdrop-blur-sm my-4 rounded-lg p-4 flex items-center gap-3 border border-white/20" key={index}>
            <div className="text-blue-300 flex-shrink-0">
              {item.icon}
            </div>

            <div className="flex-grow text-left">
              <p className="font-semibold text-base drop-shadow-sm mb-1">
                {item.title}
              </p>
              <div className="text-sm text-blue-100 drop-shadow-sm flex space-x-3">
                {item.describe}
                <div>
                  {item.type === 'list' && Array.isArray(item.score)
                    && item.score.map((score, idx) => (
                      <p key={idx} className="text-shadow-custom font-medium text-sm drop-shadow-sm">
                        {score}
                      </p>
                    )) }
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {item.type !== 'list' && (
                <p className="text-shadow-custom font-medium drop-shadow-sm">
                  {item.score}
                </p>
              )}
              <Image
                src="/assets/badge-medal.png"
                alt="Badge Medal"
                width={24}
                height={24}
                className="inline-block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
