import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import path from 'path';

import { db } from '../../lib/db';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const full_name = formData.get('full_name');
    const email = formData.get('email');
    const gender = formData.get('gender');
    const department = formData.get('department');
    const password = formData.get('password');
    const birthdate = formData.get('birthdate');
    const profilePicture = formData.get('profile_picture');

    if (
      !full_name ||
      !email ||
      !gender ||
      !department ||
      !password ||
      !birthdate
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const [existingUser] = await db.query(
      'SELECT email FROM students WHERE email = ?',
      [email],
    );
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 },
      );
    }

    let profilePicturePath = null;
    if (profilePicture && profilePicture.name) {
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      await mkdir(uploadDir, { recursive: true });
      const ext = path.extname(profilePicture.name);
      const uniqueFileName = `${nanoid()}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      await writeFile(filePath, buffer);

      profilePicturePath = `/uploads/${uniqueFileName}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = nanoid();

    await db.query(
      'INSERT INTO students (id, full_name, email, gender, department, password, birthdate, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        full_name,
        email,
        gender,
        department,
        hashedPassword,
        birthdate,
        profilePicturePath,
      ],
    );

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Signup Error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Email already registered. Try logging in.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
