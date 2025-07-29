import StarChart from '@/components/numerology/StarChart';
import Tutorial from '@/components/numerology/Tutorial';
import PreviousNavigation from '@/components/PreviousNavigation';
import type { NumerologyResponse } from '@/types/numberology';
import Image from 'next/image';

type Props = {
  baseUrl: string;
  numerologyResult: NumerologyResponse | null;
};
const Numerology = ({ baseUrl, numerologyResult }: Props) => {
  return (
    <>
      <PreviousNavigation baseUrl="/numerology" />
      <h1 className="text-shadow-custom text-medium-custom">Khám phá bản thân</h1>
      <p className="text-shadow-custom text-small-custom">Hiểu bản thân để sống đúng với bản thân</p>
      <Image width={500} height={500} className="w-[250px] h-[160px]" alt="logo 9x9" src="/assets/logo-9x9.png" />
      <StarChart baseUrl={baseUrl} numerologyResult={numerologyResult} />
      <p className="text-[#FFD8BF] mt-6 italic text-center text-small-custom text-shadow-[0px_4px_4px_rgba(255,216,191,0.50)] px-4">
        Lưu ý: Đây là những chỉ số mang tính chất tham khảo, không đảm bảo về tính chính xác tuyệt đối.
      </p>
      <Tutorial />
    </>
  );
};

export default Numerology;
