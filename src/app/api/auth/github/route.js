import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;

  return NextResponse.redirect(GITHUB_AUTH_URL);
}
