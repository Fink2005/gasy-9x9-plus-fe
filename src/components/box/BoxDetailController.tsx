'use client';

import { getCookie } from '@/app/actions/cookie';
import ChartIcon from '@/libs/shared/icons/Chart';
import ConnectionIcon from '@/libs/shared/icons/Connection';
import CopyIcon2 from '@/libs/shared/icons/Copy2';
import RightArrowIcon from '@/libs/shared/icons/RightArrow';
import { handleClipboardCopy, isClient } from '@/libs/utils';
import { useEffect, useState } from 'react';

const BoxDetailController = () => {
  const urlSharing = isClient ? `${window.location.host}/login` : '';
  const [address, setAddress] = useState<string | undefined>();
  useEffect(() => {
    (async () => {
      const authData = await getCookie('authData');
      setAddress(authData ? JSON.parse(authData)?.address : undefined);
    })();
  }, []);
  return (
    <div className="space-y-4 my-4">
      <button type="button" className="box-card-detail w-full flex items-center relative cursor-pointer" onClick={() => handleClipboardCopy(`${urlSharing}?invitedBy=${address}`)}>
        <ConnectionIcon className="translate-y-[2px] w-10" />
        <p className="text-shadow-custom text-[1rem] font-[590]">
          Chia sẻ link
          {' '}
          <span className="font-[860]">9/9</span>
        </p>
        <CopyIcon2 className="absolute right-0 top-0 size-14" />
      </button>
      <button type="button" className="box-card-detail w-full flex items-center relative cursor-pointer">
        <ChartIcon className="translate-y-[2px] w-10" />
        <p className="text-shadow-custom text-[1rem] font-[590]">
          Sơ đồ hệ thống
        </p>
        <RightArrowIcon className="absolute right-0 top-0 size-14" />
      </button>
    </div>
  );
};

export default BoxDetailController;
