import { createCookie, getCookie } from '@/app/actions/cookie';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function tokenMiddleware(request: NextRequest) {
  const accessToken = await getCookie('accessToken9x9');
  const refreshToken = await getCookie('refreshToken9x9');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const testResponse = await fetch(`${process.env.API_BASE_SERVER}/mining/start`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (testResponse.ok) {
    return NextResponse.next();
  }

  if (testResponse.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${process.env.API_BASE_SERVER}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

      const response = NextResponse.next();

      // Cập nhật access token

      createCookie({
        name: 'accessToken9x9',
        value: newAccessToken,
      });

      createCookie({
        name: 'refreshToken9x9',
        value: newRefreshToken,
      });
      return response;
    }
  }
  // Nếu không thể refresh, redirect login
  // await authRequests.logout();
  // return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}
