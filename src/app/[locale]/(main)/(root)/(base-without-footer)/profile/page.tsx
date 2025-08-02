import { getCookie } from '@/app/actions/cookie';
import PreviousNavigation from '@/components/PreviousNavigation';
import { formatAddress } from '@/libs/shared/constants/globals';
import User2Icon from '@/libs/shared/icons/User2';

const page = async () => {
  let address = await getCookie('authData');
  if (address) {
    address = JSON.parse(address).address;
  }
  return (
    <div className="bg-9x9 min-h-screen ">
      <div className="absolute left-1/2 -translate-1/2 w-full mt-6">
        <PreviousNavigation />
        <h1 className="text-shadow-custom text-center font-[590] text-[1.25rem]">Profile</h1>
      </div>
      <div className="pt-20 flex flex-col items-center">
        <User2Icon />
        <h2 className="text-shadow-custom -translate-y-6">
          {formatAddress(address || '')}
        </h2>
        <h3 className="text-shadow-custom -translate-y-5">
          NGƯỜI TRUYỀN LỬA
        </h3>
      </div>
    </div>
  );
};

export default page;
