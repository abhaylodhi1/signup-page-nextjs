import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '../../lib/db';

export async function PUT(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, email, gender, department, birthdate } =
      await req.json();

    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const [result] = await db.query(
      'UPDATE students SET full_name = ?, email = ?, gender = ?, department = ?, birthdate = ? WHERE id = ?',
      [
        full_name,
        email,
        gender,
        department,
        birthdate,
        cookieStore.get('userId')?.value,
      ],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Profile update failed' },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
