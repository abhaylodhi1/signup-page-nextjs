import { NextResponse } from 'next/server';

export async function GET() {
  const FACEBOOK_AUTH_URL = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email`;

  return NextResponse.redirect(FACEBOOK_AUTH_URL);
}
