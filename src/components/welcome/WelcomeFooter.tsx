'use client';
import { Button } from '@/components/ui/button';
import useGetCookie from '@/hooks/useGetCookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AuthData {
  isKyc: boolean;
}

const WelcomeFooter = () => {
  const { handleGetCookie } = useGetCookie<AuthData>();
  const [isKyc, setIsKyc] = useState<boolean>(false);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const authData = await handleGetCookie('authData');
        setIsKyc(authData?.isKyc || false);
      } catch (error) {
        console.error('Error fetching KYC status:', error);
        setIsKyc(false);
      }
    };

    fetchKycStatus();
  }, [handleGetCookie]);

  return (
    <>
      <Link href={isKyc ? '/' : 'introduction'}>
        <Button className="button-rounded py-[1rem]">
          <span className="text-wrap">BẮT ĐẦU HÀNH TRÌNH CỦA BẠN NGAY</span>
        </Button>
      </Link>
    </>
  );
};

export default WelcomeFooter;
