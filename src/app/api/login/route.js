import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 },
      );
    }

    const [users] = await db.query('SELECT * FROM students WHERE email = ?', [
      email,
    ]);

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      'default_secret',
      {
        expiresIn: '7d',
      },
    );

    cookies().set('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800,
    });

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
    });
  } catch {
    console.error('Login Error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
