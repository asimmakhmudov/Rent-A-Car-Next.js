import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth', req.url));
  }
  if (token && req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', req.url));
  }
  else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
