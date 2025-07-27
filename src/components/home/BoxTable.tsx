import userRequests from '@/app/apis/requests/user';
import Image from 'next/image';
import ConfirmDialog from './ConfirmDialog';

const BoxTable = async () => {
  const userData = await userRequests.userGetMe();
  return (
    <div className="grid grid-cols-3 gap-3 w-full px-6 mt-6 pb-20">
      {
        userData?.openBoxHistories.map(item => (
          <div className="box-card" key={item.boxNumber}>
            {
              item.open
                ? <Image src="/assets/box-opened.webp" width={300} height={300} className="w-18 h-20" alt="box" />
                : <Image src="/assets/box-open.webp" width={300} height={300} className="w-18 h-20" alt="box" />
            }
            <p className="text-shadow-custom font-[860] text-[12px]">{item.title}</p>
            <p className="text-shadow-custom text-nowrap font-[590] text-[10px]">{item.description}</p>
            <ConfirmDialog boxNumber={item.boxNumber} isOpenBox={item.open} />
          </div>
        ))
      }
    </div>
  );
};

export default BoxTable;
