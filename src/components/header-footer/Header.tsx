'use client';

import DropdownWallet from '@/components/home/DropdownWallet';
import Image from 'next/image';

export function Header() {
  return (
    <header className="header bg-white sticky top-0 left-0 right-0 z-50 w-full px-4 flex items-center">
      <Image width="100" height="100" alt="logo" src="/assets/logo-9x9.png" />
      <DropdownWallet />
    </header>
  );
}
