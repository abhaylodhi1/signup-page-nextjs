import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../lib/db';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, 'default_secret');
    } catch {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const [users] = await db.query(
      'SELECT id, full_name, email, gender, department, profile_picture, birthdate FROM students WHERE id = ?',
      [decoded.id],
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    if (user.birthdate) {
      user.birthdate = new Date(user.birthdate).toISOString().split('T')[0];
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
