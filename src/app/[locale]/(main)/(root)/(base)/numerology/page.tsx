import ProfileForm from '@/components/numerology/ProfileList';
import Image from 'next/image';

const page = () => {
  return (
    <div className="min-h-screen bg-9x9 flex flex-col items-center pt-10">
      <Image width="500" height="500" className="w-[200px] h-[130px]" alt="logo" src="/assets/logo-9x9.png" />
      <h1 className="text-shadow-custom text-[1.25rem] font-[590]">Thần số học</h1>
      <p className="text-shadow-custom text-[0.875rem] font-[400] text-center px-5">
        BẮT ĐẦU HÀNH TRÌNH KHÁM PHÁ CHÍNH MÌNH
        BẠN LÀ AI TRONG VŨ TRỤ 9X9?
      </p>
      <ProfileForm />
    </div>
  );
};

export default page;
