import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WelcomeFooter = () => {
  return (
    <>
      <Link href="/introduction">
        <Button className="custom-button py-[1rem]">BẮT ĐẦU HÀNH TRÌNH CỦA BẠN NGAY</Button>
      </Link>
      <div className="footer-layout-welcome ">
        <p className="footer-text-welcome ">
          “Đây không phải chương trình đầu tư tài chính.
          <br />
          {' '}
          Không cam kết lợi nhuận. Mỗi hành động đều là tự
          {' '}
          <br />
          {' '}
          nguyện và minh bạch.”
        </p>
      </div>
    </>
  );
};

export default WelcomeFooter;
