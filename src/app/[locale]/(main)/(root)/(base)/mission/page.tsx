'use client';

import { useGetMission, useUpdateMission } from '@/app/http/queries/useMission';
import GoodSign2Icon from '@/libs/shared/icons/GoodSign2';
import RightArrowIcon from '@/libs/shared/icons/RightArrow2';
import { Loader2 } from 'lucide-react';
/* eslint-disable react/no-array-index-key */
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

type Mission = {
  title: string;
  describe: string | ReactNode; // can be plain text or JSX
  score: string;
  type?: 'shareLink' | 'joinGroup' | 'readTerms';
  to?: string;
  isCompleted: boolean;
};
const Page = () => {
  const { data: dataMission, isSuccess, isLoading } = useGetMission();
  const data: Mission[] = [
    {
      title: 'Đào đủ 9 lượt/ngày',
      describe: `Hoàn thành 9 vòng đào vàng mỗi ngày - ${dataMission?.miningTimes || 0}/9`,
      score: '+99',
      isCompleted: dataMission?.miningTimes === 9
    },
    // {
    //   title: 'Kiên trì 3 ngày liên tiếp',
    //   describe: 'Tham gia liên tục 3 ngày để gieo hạt thói quen - 3/3',
    //   score: '+99'
    // },
    // {
    //   title: 'Xây thói quen 21 ngày',
    //   describe: 'Duy trì hành trình trọn vẹn 21 ngày - 3/21',
    //   score: '+999'
    // },
    // {
    //   title: 'Bền bỉ 30 ngày',
    //   describe: 'Hoàn thành hành trình 30 ngày liên tục - 3/30',
    //   score: '+999'
    // },
    {
      title: 'Kết nối bạn mới',
      describe: (
        <p>
          Mời thêm bạn bè tham gia
          {' '}
          <strong>
            9x9Plus
          </strong>
          {' '}
          (Với mỗi 1 người bạn mời bạn sẽ nhận được 999 điểm thịnh vượng)
        </p>
      ),
      score: '+999',
      isCompleted: false

    },
    {
      title: 'Lan tỏa giá trị',
      describe: 'Like & chia sẻ video trên mạng xã hội',
      score: '+999',
      type: 'shareLink',
      to: 'https://t.me/+WrtBnbRub-k5ZWM1',
      isCompleted: dataMission?.shareLink === true
    },
    {
      title: 'Tham gia group cộng đồng',
      describe: 'Gia nhập cộng đồng chính thức 9x9Plus',
      score: '+999',
      type: 'joinGroup',
      to: 'https://www.facebook.com/share/19nBvnkfwo/?mibextid=LQQJ4d',
      isCompleted: dataMission?.joinGroup === true
    },
    {
      title: 'Tìm hiểu về 9x9Plus',
      describe: (
        <p>
          Đọc và hiểu rõ về dự án
          {' '}
          <strong>
            9x9Plus
          </strong>
          {' '}
          để mở khóa hành trình nhanh hơn
        </p>
      ),
      type: 'readTerms',
      score: '+999',
      to: '/mission/info',
      isCompleted: dataMission?.readTerms === true
    },
  ];
  const router = useRouter();
  const { mutate } = useUpdateMission();
  const handleMission = (type?: 'shareLink' | 'joinGroup' | 'readTerms', to?: string) => {
    if (type) {
      mutate(type);
      if (type === 'shareLink' || type === 'joinGroup') {
        window.open(to, '_blank');
      } else if (type === 'readTerms' && to) {
        router.push(to);
      }
    }
  };

  return (
    <div className="bg-9x9 min-h-screen flex flex-col items-center text-center p-4 text-white">
      <h1 className="font-light text-xl text-blue-200 mb-2">9x9Plus</h1>
      <h2 className="font-semibold text-base mb-6 drop-shadow-lg">Nhiệm vụ</h2>

      <div className="w-full max-w-md h-[calc(100vh-180px)] overflow-y-auto">
        {isSuccess && data.map((item, index) => (
          <button
            type="button"
            onClick={() => item.type && handleMission(item.type, item.to)}
            className={`relative my-4 rounded-[0.75rem] p-4 flex border items-center gap-3 ${item.isCompleted ? 'border-[#52C41A] bg-[rgba(82,196,26,0.25)]' : 'border-[#68DAF2] bg-[rgba(0,39,102,0.25)]'}`}
            key={index}

          >
            {item.isCompleted && (
              <div className="absolute -right-[0.5px] -top-[0.5px] bg-[#52C41A] size-[1.5rem] flex items-center justify-center rounded-tr-[0.75rem] rounded-bl-[0.75rem]">
                <GoodSign2Icon />
              </div>
            )}
            <Image
              style={{
                backgroundImage: 'radial-gradient(267.72% 139.47% at 0% 2.78%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.10) 100%)'
              }}
              src="/assets/logo-9x9.png"
              width={80}
              height={80}
              className="size-18 rounded-full"
              alt="logo"
            />

            <div className="flex-grow text-left">
              <p className="font-semibold text-base drop-shadow-sm mb-1">
                {item.title}
              </p>
              <div className="text-sm text-blue-100 drop-shadow-sm flex space-x-3">
                {item.describe}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <p className="text-shadow-custom font-medium drop-shadow-sm">
                {item.score}
              </p>
              <Image
                src="/assets/badge-medal.png"
                alt="Badge Medal"
                width={24}
                height={24}
                className="inline-block"
              />
            </div>
            {item.type && (
              <div>
                <RightArrowIcon />
              </div>
            )}
          </button>
        ))}
        <div className="w-full flex justify-center items-center mt-4">
          { isLoading
            && <Loader2 className="animate-spin text-shadow-custom text-xl text-center" />}
        </div>
      </div>
    </div>
  );
};

export default Page;
