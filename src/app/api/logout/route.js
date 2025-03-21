import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieOptions = {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    };

    cookies().set('token', '', cookieOptions);
    cookies().set('userId', '', cookieOptions);

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
