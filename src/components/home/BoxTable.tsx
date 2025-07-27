import userRequests from '@/app/apis/requests/user';
import Image from 'next/image';
import ConfirmDialog from './ConfirmDialog';

const boxes = [
  {
    id: 1,
    title: 'Hộp 1',
    description: 'Sao thức tỉnh',
    boxNumber: 1,
  },
  {
    id: 2,
    title: 'Hộp 2 ',
    description: 'Sao gieo hạt',
    boxNumber: 2,
  },
  {
    id: 3,
    title: 'Hộp 3',
    description: 'Sao mở lòng',
    boxNumber: 3,
  },
  {
    id: 4,
    title: 'Hộp 4',
    description: 'Sao kết nối',
    boxNumber: 4,
  },
  {
    id: 5,
    title: 'Hộp 5',
    description: 'Sao phản chiếu',
    boxNumber: 5,
  },
  {
    id: 6,
    title: 'Hộp 6',
    description: 'Sao dẫn lối',
    boxNumber: 6,
  },
  {
    id: 7,
    title: 'Hộp 7',
    description: 'Sao khai sáng',
    boxNumber: 7,
  },
  {
    id: 8,
    title: 'Hộp 8',
    description: 'Sao rộng mở',
    boxNumber: 8,
  },
  {
    id: 9,
    title: 'Hộp 9',
    description: 'Sao kiến tạo',
    boxNumber: 9,
  }
];
const BoxTable = async () => {
  const userData = await userRequests.userGetMe();
  console.log(userData);
  return (
    <div className="grid grid-cols-3 gap-3 w-full px-6 mt-6 pb-20">
      {
        boxes.map(item => (
          <div className="box-card" key={item.id}>
            {
              ((userData!.openedBox) >= item.boxNumber)
                ? <Image src="/assets/box-opened.webp" width={300} height={300} className="w-18 h-20" alt="box" />
                : <Image src="/assets/box-open.webp" width={300} height={300} className="w-18 h-20" alt="box" />
            }
            <p className="text-shadow-custom font-[860] text-[12px]">{item.title}</p>
            <p className="text-shadow-custom text-nowrap font-[590] text-[10px]">{item.description}</p>
            <ConfirmDialog boxNumber={item.boxNumber} userData={userData} />
          </div>
        ))
      }
    </div>
  );
};

export default BoxTable;
