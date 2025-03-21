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

    // Exchange code for access token
    const { data: tokenData } = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      },
    );

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 },
      );
    }

    // Fetch user profile from Facebook
    const { data: user } = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: tokenData.access_token,
        fields: 'id,name,email,picture',
      },
    });

    const { email, name, picture } = user;
    if (!email)
      return NextResponse.json(
        { error: 'Facebook account does not provide email' },
        { status: 400 },
      );

    // Check if user exists in the database
    let [users] = await db.query('SELECT * FROM students WHERE email = ?', [
      email,
    ]);

    if (!users?.length) {
      await db.query(
        'INSERT INTO students (full_name, email, profile_picture) VALUES (?, ?, ?)',
        [name, email, picture?.data?.url || null],
      );

      [users] = await db.query('SELECT * FROM students WHERE email = ?', [
        email,
      ]);
    }

    const userRecord = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: userRecord.id, email: userRecord.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    // Set authentication cookies
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
    console.error('Facebook OAuth error:', error);
    return NextResponse.json({ error: 'OAuth login failed' }, { status: 500 });
  }
}
