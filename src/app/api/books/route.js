import { NextResponse } from 'next/server';

import { db } from '../../lib/db';

export async function GET() {
  try {
    const [books] = await db.query(
      'SELECT id, name, author, publisher, isbn, category, created_at, updated_at FROM books',
    );

    if (!books || books.length === 0) {
      return NextResponse.json({ error: 'No books found' }, { status: 404 });
    }

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
