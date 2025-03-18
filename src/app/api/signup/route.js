import bcrypt from 'bcrypt';
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
        { success: false, error: 'Missing required fields.' },
        { status: 400 },
      );
    }

    let profilePicturePath = null;

    if (profilePicture && profilePicture.name) {
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, profilePicture.name);
      await writeFile(filePath, buffer);

      profilePicturePath = `/uploads/${profilePicture.name}`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = nanoid();

    const [existingUser] = await db.query(
      'SELECT email FROM students WHERE email = ?',
      [email],
    );
    console.log('Existing User:', existingUser);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists. Please use a different email.',
        },
        { status: 400 },
      );
    }

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
        {
          success: false,
          error: 'Email already registered. Try logging in instead.',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
