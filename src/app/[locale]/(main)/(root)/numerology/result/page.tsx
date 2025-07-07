import { numerologyRequest } from '@/app/apis/requests/numerology';
import StarChart from '@/components/numerology/StarChart';
import LeftArrowIcon from '@/libs/shared/icons/LeftArrow';
import type { NumerologyResponse } from '@/types/numberology';

import Image from 'next/image';
import Link from 'next/link';

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

const page = async ({ searchParams }: { searchParams: Promise<Record<'name' | 'birth' | 'meaning', string | undefined>> }) => {
  const params = await searchParams;
  if (!params.name || !params.birth) {
    return <div className="min-h-screen bg-numerology text-center flex items-center justify-center text-shadow-custom">Missing name or birth date parameters.</div>;
  }
  const name = params.name ?? '';
  const birth = params.birth ?? '';
  const meaning = params.meaning;
  const numerologyResult = await numerologyRequest.getNumerology(name, birth);
  const baseUrl = `/numerology/result?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}`;

  const meaningList = numerologyResult?.meaning[meaning as keyof NumerologyResponse['meaning']] || [];

  if (meaning) {
    return (
      <div className="overflow-y-auto bg-meaning flex flex-col items-center pt-10 relative px-3 min-h-screen h-[200px] pb-16 overflow-x-hidden">
        <Link href={baseUrl}>
          <LeftArrowIcon className="absolute left-4" />
        </Link>
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
  }
  return (
    <div className="min-h-screen bg-numerology flex flex-col items-center pt-10 relative overflow-x-hidden overflow-y-auto h-[200px] ">
      <Link href="/numerology">
        <LeftArrowIcon className="absolute left-4" />
      </Link>
      <h1 className="text-shadow-custom text-medium-custom">Khám phá bản thân</h1>
      <p className="text-shadow-custom text-small-custom">Hiểu bản thân để sống đúng với bản thân</p>
      <Image width={500} height={500} className="w-[250px] h-[160px]" alt="logo 9x9" src="/assets/logo-9x9.png" />
      <StarChart baseUrl={baseUrl} numerologyResult={numerologyResult} />
      <p className="text-[#FFD8BF] mt-6 italic text-center text-small-custom text-shadow-[0px_4px_4px_rgba(255,216,191,0.50)] px-4 pb-14">
        Lưu ý: Đây là những chỉ số mang tính chất tham khảo, không đảm bảo về tính chính xác tuyệt đối.
      </p>
    </div>
  );
};

export default page;
