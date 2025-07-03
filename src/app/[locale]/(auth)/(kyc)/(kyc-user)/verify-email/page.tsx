import OTPForm from '@/components/KYC/OTPForm';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback="">
      <OTPForm />
    </Suspense>
  );
};

export default page;
