import { NextResponse } from 'next/server';

export function middleware(req) {
  console.error('Request URL:', req.url); // Log the full URL
  const token = req.cookies.get('token');
  console.error('Token:', token);

  if (!token) {
    console.error('Redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
