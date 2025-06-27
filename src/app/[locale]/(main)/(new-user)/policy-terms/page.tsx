import { montserrat } from '@/app/fonts/montserrat';
import { Button } from '@/components/ui/button';
import CheckCircle from '@/libs/shared/icons/CheckCircle';
import Link from 'next/link';

const policyTerms = [
  {
    title: 'Giới thiệu chung dự án 9x9Plus là một nền tảng kết nối cộng đồng dựa trên nguyên tắc minh bạch, chia sẻ thiện chí và tự nguyện. Mọi hành động “mở khoá” được xem là hành động gieo hạt giá trị và kết nối với cộng đồng, không mang tính chất đầu tư tài chính hay kinh doanh đa cấp.'
  },
  {
    title: 'Quyền lợi và nghĩa vụ của người tham gia',
    subtitle: (
      <ul>
        <li>Được quyết định tự nguyện tham gia hay không tham gia vào bất kỳ thời điểm nào.</li>
        <li>Hiểu rõ và đồng ý với nguyên tắc: không cam kết lợi nhuận, không bảo đảm hoàn vốn.</li>
        <li>Được truy cập thông tin minh bạch về các lần “mở khoá”, số liệu gieo hạt và hệ thống liên quan.</li>
        <li>Đóng góp mỗi khoản là tự nguyện và đã hiểu rõ không nhằm mục đích sinh lợi.</li>
      </ul>
    )
  },
  {
    title: 'Cam kết của người tham gia',
    subtitle: (
      <ul>
        <li>
          Tôi đã đọc, hiểu và đồng ý với mô hình của
          <strong>9x9Plus</strong>
        </li>
        <li>Tôi không mong đợi hoặc kỳ vọng lợi nhuận tài chính.</li>
        <li>Tôi đóng góp mỗi khoản là sự lựa chọn tự nguyện.</li>
        <li>Tôi sẽ không khiếu nại hoặc yêu cầu trả lại bất kỳ khoản nào đã đóng góp.</li>
      </ul>
    )
  },
  {
    title: 'Trách nhiệm và cam kết của 9x9Plus',
    subtitle: (
      <ul>
        <li>
          Cung cấp đầy đủ thông tin minh bạch và công khai về hoạt động.
        </li>
        <li>Tuyên truyền rõ ràng đây không phải hoạt động đầu tư tài chính đa cấp.</li>
        <li>Tuân thủ pháp luật Việt Nam và cam kết hợp tác với cơ quan chức năng khi có yêu cầu.</li>
      </ul>
    )
  },
  {
    title: 'Có chế xử lý vi phạm',
    subtitle: (
      <ul>
        <li>Mọi trường hợp gian lận, lợi dụng, lôi kéo sai sự thật sẽ bị xử lý tuỳ theo mức độ vi phạm (Cảnh báo, đình chỉ hoặc xoá quyền truy cập).</li>
      </ul>
    )
  },
  {
    title: 'Thay đổi và điểu chỉnh 9x9Plus có quyền thay đổi điều khoản khi có cập nhật hệ thống hoặc thay đổi quy trình hoạt động. Mọi thay đổi sẽ được thông báo trước trên giao diện website/ứng dụng.'
  }

];
const page = () => {
  return (
    <div className="pt-20 flex flex-col items-center">
      <h1 className={`${montserrat.variable} title-introduction`}>
        ĐIỀU KHOẢN SỬ DỤNG VÀ
        <br />
        {' '}
        CHÍNH SÁCH NGƯỜI THAM GIA
      </h1>
      <div className={`${montserrat.variable} layout-policy`}>
        <ol className="text-policy">
          {policyTerms.map(item => (
            <li key={item.title} className="policy-item">
              <h2 className="policy-title">{item.title}</h2>
              {item.subtitle && <div className="policy-subtitle">{item.subtitle}</div>}
            </li>
          ))}
          <p className="-translate-x-4 mt-1">
            Bằng việc tiếp tục sử dụng
            <strong>9x9Plus</strong>
            , bạn đã đồng ý và tuân thủ các điều khoản nêu trên
          </p>
        </ol>

        <Link href="/welcome">
          <Button className="custom-button mt-[1.13rem]">
            <CheckCircle />
            <span
              className={`${montserrat.variable} font-[700] text-[0.875rem]`}
              style={{ textShadow: '0px 4px 15px rgba(145, 213, 255, 0.50)' }}
            >
              Tôi đã đọc và hiểu mô hình 9x9Plus
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
