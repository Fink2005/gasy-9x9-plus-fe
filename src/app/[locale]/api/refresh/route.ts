// app/api/auth/refresh-token/route.ts
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

  response.cookies.set('accessToken9x9', data.accessToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  response.cookies.set('refreshToken9x9', data.refreshToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}
