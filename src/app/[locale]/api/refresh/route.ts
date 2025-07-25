// app/api/auth/refresh-token/route.ts
import { createCookie } from '@/app/actions/cookie';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies(); // 👈 đúng API
  const refreshToken = cookieStore.get('refreshToken9x9')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const res = await fetch(`${process.env.API_BASE_SERVER}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: 'Refresh token invalid' }, { status: 401 });
  }

  const response = NextResponse.json({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  createCookie({
    name: 'accessToken9x9',
    value: data.accessToken,
  });
  createCookie({
    name: 'refreshToken9x9',
    value: data.refreshToken,
  });
  return response;
}
