import userRequest from '@/app/http/requests/user';

import Image from 'next/image';
import ConfirmDialog from './ConfirmDialog';

const BoxTable = async () => {
  const userData = await userRequest.userGetMe();

  return (
    <div className="grid grid-cols-3 gap-3 w-full px-6 mt-6 pb-20 max-">
      {
        userData?.openBoxHistories && userData?.openBoxHistories.map((item, index) => (
          <div className="box-card max-h-[170px]" key={item.boxNumber}>
            {
              item.open
                ? <Image src="/assets/box-opened.webp" width={300} height={300} className="w-26 h-26" alt="box" />
                : <Image src="/assets/box-open.webp" width={300} height={300} className="w-26 h-26" alt="box" />
            }
            <div className="flex flex-col items-center space-y-1 -translate-y-3">
              <p className="text-shadow-custom font-[860] text-[12px]">
                Box
                {' '}
                {index + 1}
              </p>
              <p className="text-shadow-custom text-nowrap font-[590] text-[10px]">{item.description.title}</p>
              <ConfirmDialog boxNumber={item.boxNumber} isOpenBox={item.open} currentBox={userData.currentBox} />
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default BoxTable;
