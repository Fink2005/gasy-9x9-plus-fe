import userRequests from '@/app/http/requests/user';
import PreviousNavigation from '@/components/PreviousNavigation';
import Arrow3Icon from '@/libs/shared/icons/Arrow3';
import ConnectionIcon from '@/libs/shared/icons/Connection';
import DiamonIcon from '@/libs/shared/icons/Diamon';
import GamePad4 from '@/libs/shared/icons/GamePad4';
import TelegramIcon from '@/libs/shared/icons/Telegram';
import TeleScopeIcon from '@/libs/shared/icons/telescope';
import User2Icon from '@/libs/shared/icons/User2';
import UserConnection from '@/libs/shared/icons/UserConnection';
import { formatAddress } from '@/libs/utils';

const page = async () => {
  const userRes = await userRequests.userGetMe();
  const userData = [
    {
      id: 1,
      title: `Điểm Thịnh Vượng: ${userRes?.score || 0}`,
      icon: GamePad4,
    },
    {
      id: 2,
      title: `Hành trình: ${userRes?.continiousPlayDay || 0}  ngày liên tục`,
      icon: DiamonIcon,
    },
    {
      id: 3,
      title: `Cộng đồng của bạn: ${userRes?.amount}  thành viên`,
      icon: UserConnection,
    },
    {
      id: 4,
      title: `Con số chủ đạo: ${userRes?.mainNumber || 0}`,
      icon: TeleScopeIcon,
    },
  ];

  return (
    <div className="bg-9x9 min-h-screen px-4">
      <div className="absolute left-1/2 -translate-1/2 w-full mt-6">
        <PreviousNavigation />
        <h1 className="text-shadow-custom text-center font-[590] text-[1.25rem]">Profile</h1>
      </div>
      <div className="pt-20 flex flex-col items-center">
        <User2Icon />
        <h2 className="text-shadow-custom -translate-y-6">
          {formatAddress(userRes?.address || '', 5)}
        </h2>
        <h3 className="text-shadow-custom -translate-y-5">
          {userRes?.badges?.length !== 0 && userRes?.badges[userRes?.badges?.length - 1]}
        </h3>
      </div>
      <div className="bg-card-info  relative">
        <div className="flex justify-center items-center -translate-x-5 h-12">
          <Arrow3Icon className=" translate-x-5 translate-y-1" />
          <p className="text-shadow-custom font-[860] text-[1.125rem] text-center translate-x-4 bor">HÀNH TRÌNH CỦA BẠN</p>
        </div>
        {
          userData.map(item => (
            <div key={item.id} className="flex items-center justify-between  border-b border-white/10">
              <div className="flex items-center gap-2">
                <item.icon className="w-20 h-14 text-white" />
                <span className="text-shadow-custom text-[1rem] font-[860]">{item.title}</span>
              </div>
            </div>
          ))
        }
      </div>

      <div className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4">
        <ConnectionIcon />
        <p className="text-shadow-custom">Chia sẻ hành trình của bạn</p>
      </div>
      <div className="rounded-md bg-[rgba(255,255,255,0.20)] flex items-center h-12 my-4 space-x-2">
        <TelegramIcon className="ms-4" />
        <p className="text-shadow-custom">Tổng đài</p>
      </div>
    </div>
  );
};

export default page;
