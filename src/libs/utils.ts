import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { devtools } from 'zustand/middleware';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const withDevTools = (fn: any) =>
  process.env.NEXT_PUBLIC_NOVEL_ENV !== 'prod' ? devtools(fn) : fn;

export function NumberFormat(number: number): string {
  const formatted = number.toLocaleString('de-DE');

  return formatted;
}

export const isClient = () => typeof window !== 'undefined';
