import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { db } from '../../lib/db';

const SECRET_KEY = 'your_secret_key';

export async function GET(req) {
  try {
    // 🔹 Extract and verify JWT token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const [users] = await db.query(
      'SELECT full_name, email, gender, department, profile_picture FROM students WHERE id = ?',
      [decoded.id],
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0], { status: 200 });
  } catch (err) {
    console.error('Error fetching user:', err); // ✅ Log the error to use the variable
    return NextResponse.json({ error: 'Invalid Token' }, { status: 403 });
  }
}
