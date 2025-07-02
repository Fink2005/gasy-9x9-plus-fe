import OTPForm from '@/components/KYC/OTPForm';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
};

export default page;
