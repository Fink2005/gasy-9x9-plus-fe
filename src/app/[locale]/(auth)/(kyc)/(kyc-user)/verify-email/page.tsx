import OTPForm from '@/components/KYC/OTPForm';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <OTPForm />
    </Suspense>
  );
};

export default page;
