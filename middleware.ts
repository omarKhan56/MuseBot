import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin-login');
  const isLoginApi = request.nextUrl.pathname.startsWith('/api/admin/login');

  // Never block the login page or login API itself
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  if (isAdminPage || isAdminApi) {
    const authCookie = request.cookies.get('admin_auth');

    if (authCookie?.value !== process.env.ADMIN_PASSWORD) {
      if (isAdminPage) {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};