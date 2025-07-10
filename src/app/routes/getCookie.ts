// pages/api/auth/token.ts or app/api/auth/token/route.ts
export async function GET() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('authData');

  if (!authCookie?.value) {
    return Response.json({ error: 'No token found' }, { status: 401 });
  }

  const authData = JSON.parse(authCookie.value);
  return Response.json({ accessToken: authData.accessToken });
}
