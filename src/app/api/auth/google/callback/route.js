import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../../../lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    console.log(code);

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code missing' },
        { status: 400 },
      );
    }

    const { data: tokenData } = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      },
    );

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 },
      );
    }

    const { data: user } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    const { email, name, picture } = user;
    if (!email)
      return NextResponse.json({ error: 'No email found' }, { status: 400 });

    let [users] = await db.query('SELECT * FROM students WHERE email = ?', [
      email,
    ]);

    if (!users?.length) {
      await db.query(
        'INSERT INTO students (full_name, email, profile_picture) VALUES (?, ?, ?)',
        [name, email, picture],
      );

      [users] = await db.query('SELECT * FROM students WHERE email = ?', [
        email,
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

    const cookieStore = cookies();
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
    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: 'OAuth login failed' }, { status: 500 });
  }
}
