import Image from 'next/image';
import ConfirmDialog from './ConfirmDialog';

const boxes = [
  {
    id: 1,
    title: 'Hộp 1',
    description: 'Sao thức tỉnh',
  },
  {
    id: 2,
    title: 'Hộp 2 ',
    description: 'Sao gieo hạt',
  },
  {
    id: 3,
    title: 'Hộp 3',
    description: 'Sao mở lòng',
  },
  {
    id: 4,
    title: 'Hộp 4',
    description: 'Sao kết nối',
  },
  {
    id: 5,
    title: 'Hộp 5',
    description: 'Sao phản chiếu',
  },
  {
    id: 6,
    title: 'Hộp 6',
    description: 'Sao dẫn lối',
  },
  {
    id: 7,
    title: 'Hộp 7',
    description: 'Sao khai sáng',
  },
  {
    id: 8,
    title: 'Hộp 8',
    description: 'Sao rộng mở',
  },
  {
    id: 9,
    title: 'Hộp 9',
    description: 'Sao kiến tạo',
  }
];
const BoxTable = () => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full px-6 mt-6 pb-20">
      {
        boxes.map(item => (
          <div className="box-card" key={item.id}>
            <Image src="/assets/starBox.webp" width={80} height={80} alt="box" />
            <p className="text-shadow-custom font-[860] text-[12px]">{item.title}</p>
            <p className="text-shadow-custom text-nowrap font-[590] text-[10px]">{item.description}</p>
            <ConfirmDialog />
          </div>
        ))
      }

    </div>
  );
};

export default BoxTable;
