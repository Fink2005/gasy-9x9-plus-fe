import ControllerIcon from '@/libs/shared/icons/Controller';
import HouseIcon from '@/libs/shared/icons/House';
import HumanIcon from '@/libs/shared/icons/Human';
import NotesIcon from '@/libs/shared/icons/Notes';
import QuestionIcon from '@/libs/shared/icons/Question';

const tabBar = [
  {
    icon: HouseIcon,
    title: 'Trang chủ',
    link: '/',
  },
  {
    icon: HumanIcon,
    title: 'Thần số học',
    link: '#',
  },
  {
    icon: ControllerIcon,
    title: 'Đào vàng',
    link: '#',
  },
  {
    icon: NotesIcon,
    title: 'Bảng xếp hạng',
    link: '#',
  },
  {
    icon: QuestionIcon,
    title: 'Nhiệm vụ',
    link: '#',
  },
];

export function Footer() {
  return (
    <footer className="absolute bottom-0 w-full footer">
      {
        tabBar.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="footer-items opacity-50">
              <Icon />
              <span
                className="text-white font-[500] text-[0.5625rem]"
              >
                {item.title}
              </span>
            </div>
          );
        })
      }
    </footer>
  );
}
