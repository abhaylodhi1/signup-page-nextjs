import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = cookies().get('token');
  if (!token) {
    console.log('Redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/books', '/profile'],
};
