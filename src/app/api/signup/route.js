import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import path from 'path';

import { db } from '../../lib/db';
import { writeFile } from 'fs/promises';

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

    let profilePicturePath = null;

    if (
      !full_name ||
      !email ||
      !gender ||
      !department ||
      !password ||
      !birthdate
    ) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 },
      );
    }

    if (profilePicture && profilePicture.name) {
      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = path.join(uploadDir, profilePicture.name);

      await writeFile(filePath, buffer);
      profilePicturePath = `/uploads/${profilePicture.name}`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      message: 'User registered successfully',
      userId,
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
