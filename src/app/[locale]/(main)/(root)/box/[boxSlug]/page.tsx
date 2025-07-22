import BoxCard from '@/components/box/boxCard';
import LeftArrowIcon from '@/libs/shared/icons/LeftArrow';
import Link from 'next/link';

type PageProps = {
  params: {
    boxSlug: string;
  };
};

const page = ({
  params: { boxSlug },
}: PageProps) => {
  return (
    <div className="min-h-screen bg-9x9 flex flex-col items-center pt-10">
      <Link href="/numerology">
        <LeftArrowIcon className="absolute left-4" />
      </Link>
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-shadow-custom text-[1.25rem] font-[700]">Box 1 - Sao thức tỉnh</h1>
        <h2 className="text-shadow-custom text-[0.75rem] font-[400] text-center">
          Khởi động hành trình - Gặp sao đầu tiên
          <br />
          {' '}
          & nhận thông điệp khai sáng.
        </h2>
      </div>
      <BoxCard boxSlug={boxSlug} />
    </div>
  );
};

export default page;
