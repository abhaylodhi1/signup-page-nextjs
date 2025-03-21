import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../../lib/db';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    const token = body.token;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    const [existingUser] = await db.query(
      'SELECT id, full_name, email, profile_picture FROM students WHERE email = ?',
      [email],
    );

    let user;
    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const result = await db.query(
        'INSERT INTO students (full_name, email, profile_picture) VALUES (?, ?, ?)',
        [name, email, picture],
      );

      user = {
        id: result.insertId,
        email,
        name,
        picture,
      };
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.full_name || user.name,
        picture: user.profile_picture || user.picture,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
    );

    cookies().set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      message:
        existingUser.length > 0 ? 'Login successful' : 'Signup successful',
      user,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
}
