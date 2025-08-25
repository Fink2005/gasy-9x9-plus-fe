import userRequest from '@/app/http/requests/user';
import InputName from '@/components/profile/InputName';
import ProfileController from '@/components/profile/ProfileController';
import Arrow3Icon from '@/libs/shared/icons/Arrow3';
import DiamonIcon from '@/libs/shared/icons/Diamon';
import GamePad4 from '@/libs/shared/icons/GamePad4';
import UserConnection from '@/libs/shared/icons/UserConnection';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const Profile = async () => {
  const userRes = await userRequest.userGetMe();

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
    // {
    //   id: 4,
    //   title: `Con số chủ đạo: ${userRes?.mainNumber || 0}`,
    //   icon: TeleScopeIcon,
    // },
  ];
  return (
    <>
      <div className="pt-20 flex flex-col items-center">
        <div className="size-24 rounded-full flex items-center justify-center bg-[#000C36] border">
          <Image
            src="/assets/logo-9x9.png"
            width={80}
            height={80}
            className="size-18 rounded-full"
            alt="logo"
          />
        </div>
        <InputName name={userRes?.name} />
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
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="w-20 h-14 text-white translate-y-1" />
                <span className="text-shadow-custom text-[1rem] font-[860]">{item.title}</span>
              </div>
            </div>
          ))
        }
      </div>
      <ProfileController address={userRes?.name || ''} />
    </>

  );
};

export default Profile;
