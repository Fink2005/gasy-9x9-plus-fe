'use client';

import { SafePal } from '@/components/wallet/SafePal';

export function Header() {
  return (
    <header className="header bg-white sticky top-0 left-0 right-0 z-50 w-full px-4 ">
      <SafePal type="small" />
    </header>
  );
}
