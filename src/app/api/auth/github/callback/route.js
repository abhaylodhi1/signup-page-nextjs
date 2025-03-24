import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code missing' },
        { status: 400 },
      );
    }

    const { data: tokenData } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      { headers: { Accept: 'application/json' } },
    );

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 },
      );
    }

    const { data: user } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const { data: emails } = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    )?.email;

    if (!primaryEmail) {
      return NextResponse.json(
        { error: 'GitHub account does not provide email' },
        { status: 400 },
      );
    }

    let [users] = await db.query('SELECT * FROM students WHERE email = ?', [
      primaryEmail,
    ]);

    if (!users?.length) {
      await db.query(
        'INSERT INTO students (full_name, email, profile_picture) VALUES (?, ?, ?)',
        [user.name, primaryEmail, user.avatar_url],
      );

      [users] = await db.query('SELECT * FROM students WHERE email = ?', [
        primaryEmail,
      ]);
    }

    const userRecord = users[0];

    const token = jwt.sign(
      { id: userRecord.id, email: userRecord.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('userId', String(userRecord.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json({ error: 'OAuth login failed' }, { status: 500 });
  }
}
