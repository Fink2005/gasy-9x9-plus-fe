import { Button } from '@/components/ui/button';
import HandMoney from '@/libs/shared/icons/HandMoney';
import Link from 'next/link';

const IntroductionFooter = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-[0.12rem]">
      <p className="footer-title-introduction">
        Mọi hành động của bạn đều được ghi nhận - minh bạch -
        <br />
        {' '}
        không bỏ sót - không mất đi.
      </p>
      <p className="footer-subtitle-introduction pb-[0.75rem] pt-[0.62rem]">Bạn đã sẵn sàng chia sẻ cho 9 người bạn của mình chứ?</p>
      <Link href="/kyc" className="max-w-[20.9375rem] w-full">
        <Button className="button-rounded w-full">
          <HandMoney />
          <span className="-translate-x-4">
            Mở khóa ngay
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default IntroductionFooter;
