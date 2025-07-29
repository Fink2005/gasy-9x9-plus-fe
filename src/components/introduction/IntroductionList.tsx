import { montserrat } from '@/app/fonts/montserrat';
import IntroductionFooter from '@/components/introduction/IntroductionFooter';
import GamePadIcon from '@/libs/shared/icons/GamePad';
import GraphUpIcon from '@/libs/shared/icons/GraphUp';
import HammerIcon from '@/libs/shared/icons/Hammer';
import HeartLockIcon from '@/libs/shared/icons/HeartLock';
import RocketIcon from '@/libs/shared/icons/Rocket';

const dataIntro = [
  {
    icon: RocketIcon,
    title: 'Tầm nhìn',
    des: <p>Trở thành nền tảng cộng đồng chia sẻ giá trị minh bạch - nơi kết nối thiện chí và lan toả ý nghĩa vì sự phát triển bền vững đến hàng triệu người</p>,
  },
  {
    icon: HeartLockIcon,
    title: 'Sứ mệnh',
    des: (
      <p>
        Gieo giá trị - Mở khoá tiềm năng - Đồng hành cùng cộng đồng hướng đến nhận thức và trách nhiệm xã hội - Bắt đầu với sự đóng góp tự nguyện 26$.
      </p>
    ),
  },
  {
    icon: GraphUpIcon,
    title: 'GIÁ TRỊ CỐT LÕI',
    des: (
      <>
        <p>
          <strong>An tâm</strong>
          : Minh bạch - Rõ ràng - Đồng hành cùng nhau, không ai bị bỏ lại.
        </p>
        <p>
          <strong>Lan tỏa</strong>
          : Kết nối - Chia sẻ - Cộng hưởng giá trị.
        </p>
        <p>
          <strong>Bền vững</strong>
          : Vận hành tự chủ, minh bạch, ứng dụng công nghệ Web3 vì mục tiêu cộng đồng.
        </p>
      </>
    ),
  },
  {
    icon: GamePadIcon,
    title: 'CÁCH THỨC THAM GIA',
    des: (
      <>
        <ol className="">
          <li>
            Tham gia bằng cách đóng góp tự nguyện 26$ để bắt đầu hành trình “mở khóa”.
          </li>
          <li>
            Mỗi chu kỳ mở khóa gồm 9 lượt gieo hạt kết nối.
          </li>
          <li>
            Mỗi lần mở khóa là một hành động đóng góp giá trị vào cộng đồng.
          </li>
          <li>Sau khi hoàn tất một chu kỳ, người tham gia có thể tiếp tục một hành trình mới nếu mong muốn.</li>
        </ol>
      </>
    ),
  },
  {
    icon: HammerIcon,
    title: 'LUẬT CHƠI',
    des: (
      <>
        <ul className="">
          <li>Mỗi đóng góp là một hạt giá trị được gieo - hành trình “mở khóa” gồm 9 bước kết nối.</li>
          <li>Không có cam kết tài chính - chỉ có sự minh bạch và tự nguyện.</li>
          <li>Cộng đồng cùng tiến - không ai bị bỏ lại phía sau.</li>
        </ul>
      </>
    ),
  }
];

const IntroductionList = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {dataIntro.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="introduction-list-items">
            <div>
              <Icon className="-translate-y-2 size-10" />
            </div>
            <div>
              <h3 className={`${montserrat.variable} introduction-title-items`}>{item.title}</h3>
              <div className="introduction-des-items pe-3 text-wrap">
                {item.des}
              </div>
            </div>
          </div>
        );
      })}
      <IntroductionFooter />
    </div>
  );
};

export default IntroductionList;
