import CalendarColorIcon from '@/libs/shared/icons/CalendarColor';
import ChartIcon from '@/libs/shared/icons/Chart';
import ConnectionIcon from '@/libs/shared/icons/Connection';
import CopyIcon2 from '@/libs/shared/icons/Copy2';
import HandMoney2 from '@/libs/shared/icons/HandMoney2';
import HeartUnlockIcon from '@/libs/shared/icons/HeartUnlock';
import MoneyMessageIcon from '@/libs/shared/icons/MoneyMessage';
import MoneySuitcaseIcon from '@/libs/shared/icons/MoneySuitcase';
import MoneyWalletIcon from '@/libs/shared/icons/MoneyWallet';
import RightArrowIcon from '@/libs/shared/icons/RightArrow';
import ShieldIcon from '@/libs/shared/icons/Shield';
import UserConnection from '@/libs/shared/icons/UserConnection';
import UserHeart from '@/libs/shared/icons/UserHeart';
import Image from 'next/image';

type Props = {
  boxSlug: string;
};

const BoxCard = ({ boxSlug }: Props) => {
  const data = [
    { icon: <UserHeart />, label: 'Tổng kết nối hệ thống:', value: '230' },
    { icon: <HeartUnlockIcon />, label: 'Hành trình mở khóa:', value: '3/9' },
  ];

  const details = [
    { id: 'userHeart', icon: <UserHeart />, label: 'Người kết nối:', value: '0xB3b5...5A' },
    { id: 'heartUnlock', icon: <HeartUnlockIcon />, label: 'Box:', value: '3/9' },
    { id: 'calendar', icon: <CalendarColorIcon />, label: 'Tham gia:', value: '22/07/2025' },
    { id: 'handMoney', icon: <HandMoney2 />, label: 'Tổng giá trị gieo:', value: '130$/234$' },
    { id: 'userConnection', icon: <UserConnection />, label: 'Kết nối lan tỏa:', value: '9 người' },
    { id: 'moneyMessage', icon: <MoneyMessageIcon />, label: 'Đã nhận tri ân:', value: '90$' },
    { id: 'moneySuitcase', icon: <MoneySuitcaseIcon />, label: 'Cộng hưởng lan tỏa:', value: '90$' },
    { id: 'moneyWallet', icon: <MoneyWalletIcon />, label: 'Cộng hưởng bền vững:', value: '45$' },
    { id: 'shield', icon: <ShieldIcon />, label: 'Giá trị tích lũy:', value: '45$' },
  ];

  return (
    <div className="w-full ">
      <span className="hidden">{boxSlug}</span>
      <div className="box-card-detail w-full py-2">
        {data.map((item, index) => (
          <div className="flex items-center h-8" key={index}>
            {item.icon}
            <p className="text-shadow-custom text-[1rem] font-[590]">
              {item.label}
              {' '}
              <span className="font-[860]">{item.value}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="box-card-detail w-full py-2 mt-4 relative">
        {details.map(item => (
          <div key={item.id}>
            <div className="flex items-center h-8">
              <div className="translate-y-[2px] w-10">
                {item.icon}
              </div>
              <p className="text-shadow-custom text-[1rem] font-[590]">
                {item.label}
                {' '}
                <span className="font-[860]">{item.value}</span>
              </p>
            </div>
            {item.id === 'calendar' && (
              <div className="flex items-center justify-center my-2 w-full">
                <hr className="w-[92%] border-t border-t-[rgba(255, 255, 255, 0.50)]" />
              </div>
            )}
          </div>
        ))}
        <Image
          src="/assets/robot-hello.webp"
          width={100}
          height={100}
          alt="robot-hello"
          className="absolute bottom-4 right-1"
        />
      </div>

      <div className="space-y-4 my-4">
        <div className="box-card-detail flex items-center relative cursor-pointer">
          <ConnectionIcon className="translate-y-[2px] w-10" />
          <p className="text-shadow-custom text-[1rem] font-[590]">
            Chia sẻ link
            {' '}
            <span className="font-[860]">9/9</span>
          </p>
          <CopyIcon2 className="absolute right-0 top-0 size-14" />
        </div>
        <div className="box-card-detail flex items-center relative cursor-pointer">
          <ChartIcon className="translate-y-[2px] w-10" />
          <p className="text-shadow-custom text-[1rem] font-[590]">
            Sơ đồ hệ thống
          </p>
          <RightArrowIcon className="absolute right-0 top-0 size-14" />
        </div>
      </div>
    </div>
  );
};

export default BoxCard;
