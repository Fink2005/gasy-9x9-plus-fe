import PreviousNavigation from '@/components/PreviousNavigation';
import type { NumerologyResponse } from '@/types/numberology';
import Image from 'next/image';

type Props = {
  baseUrl: string;
  meaning: keyof NumerologyResponse['meaning'];
  meaningList: NumerologyResponse['meaning'][keyof NumerologyResponse['meaning']] | null;
  numerologyResult: NumerologyResponse | null | undefined;
};
const meaningOptions = [
  {
    id: 'destiny',
    title: 'SỨ MỆNH',
    subtitle: 'Người chữa lành và cống hiến'
  },
  {
    id: 'personality',
    title: 'TÍNH CÁCH',
    subtitle: 'Trưởng thành, bao dung, đầy thấu cảm'
  },
  {
    id: 'lifePath',
    title: 'ĐƯỜNG ĐỜI',
    subtitle: 'Hành trình của yêu thương và buông bỏ'
  },
  {
    id: 'body',
    title: 'THỂ CHẤT',
    subtitle: 'Nhạy cảm và dễ bị ảnh hưởng năng lượng'
  },
  {
    id: 'soul',
    title: 'TÂM HỒN',
    subtitle: 'Linh hồn già dặn và hướng về chữa lành'
  }
];
const Meaning = ({ baseUrl, meaning, meaningList, numerologyResult }: Props) => {
  return (
    <div className="overflow-y-auto bg-meaning flex flex-col items-center pt-10 relative px-3 min-h-screen h-[200px] pb-16 overflow-x-hidden">
      <PreviousNavigation baseUrl={baseUrl} isReload />

      <h1 className="text-shadow-custom text-medium-custom">
        {
          meaningOptions.find(option => option.id === meaning)?.title || 'Kết quả Numerology'
        }
      </h1>
      <h2 className="text-shadow-custom text-small-custom">
        {
          meaningOptions.find(option => option.id === meaning)?.subtitle || 'Kết quả Numerology'
        }
      </h2>
      <div className="mt-5">
        {Array.isArray(meaningList) ? meaningList.map(item => (
          <div key={item.title} className="flex my-[0.75rem]">
            <Image width="100" height="100" className="h-[45px] w-[50px]" alt="logo" src="/assets/logo-9x9.png" />
            <div className="flex flex-col items-baseline ms-[0.5rem] space-y-[0.25rem]">
              <h3 className="text-shadow-custom text-[0.875rem] font-[860] text-left uppercase">
                {item.title}
              </h3>
              <p className="text-shadow-custom text-small-custom text-left">
                {item.content}
              </p>
            </div>
          </div>
        )) : (
          <p className="text-shadow-custom text-[0.875rem] font-[400] text-center px-5">
            {numerologyResult?.meaning[meaning as keyof NumerologyResponse['meaning']].toString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Meaning;
