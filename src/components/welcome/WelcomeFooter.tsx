'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  isKyc: boolean;
};

const WelcomeFooter = ({ isKyc }: Props) => {
  return (
    <>
      <Link href={isKyc ? '/' : 'introduction'} prefetch>
        <Button className="button-rounded py-[1rem]">
          <span className="text-wrap">BẮT ĐẦU HÀNH TRÌNH CỦA BẠN NGAY</span>
        </Button>
      </Link>
    </>
  );
};

export default WelcomeFooter;
