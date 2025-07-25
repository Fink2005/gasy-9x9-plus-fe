import BoxCard from '@/components/box/BoxCard';
import BoxTable from '@/components/box/BoxTable';
import LeftArrowIcon from '@/libs/shared/icons/LeftArrow';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    locale: string;
    boxSlug: string;
  }>;
};

const page = async ({ params }: PageProps) => {
  const { boxSlug, locale } = await params;

  return (
    <div className="min-h-screen bg-9x9 flex flex-col items-center pt-10 px-3 sm:px-7">
      <Link href="/">
        <LeftArrowIcon className="absolute left-4" />
      </Link>
      <span className="hidden">{locale}</span>
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
      <BoxTable />
    </div>
  );
};

export default page;
