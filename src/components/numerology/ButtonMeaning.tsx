'use client';
import { Button } from '@/components/ui/button';

const ButtonMeaning = ({ baseUrl }: { baseUrl: string }) => {
  const handleNavigation = (meaning: string) => {
    window.location.href = `${baseUrl}&meaning=${meaning}`;
  };
  return (
    <Button className="button-base w-full max-w-[343px] cursor-pointer z-20" onClick={() => handleNavigation('true')}>
      Thông điệp dành cho bạn
    </Button>
  );
};

export default ButtonMeaning;
