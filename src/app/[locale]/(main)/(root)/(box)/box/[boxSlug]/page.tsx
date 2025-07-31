import { boxRequest } from '@/app/apis/requests/box';
import BoxCardDetail from '@/components/box/BoxCardDetail';
import BoxTableDetail from '@/components/box/BoxTableDetail';
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
  const resBoxDetail = await boxRequest.boxDetail(boxSlug ? +boxSlug : 0);
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
      <BoxCardDetail boxSlug={boxSlug} dataBoxDetail={resBoxDetail} />
      <BoxTableDetail />
    </div>
  );
};

export default page;
