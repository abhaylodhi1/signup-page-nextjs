// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Middleware triggered'); // Log to check if the middleware is running

  const token = req.cookies.get('token'); // For cookies-based token

  // For localStorage, you can't check it here, so we handle it client-side.
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('No token found. Redirecting to login...');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('Token found. Proceeding with the request...');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Applies middleware to all paths under /dashboard
};
