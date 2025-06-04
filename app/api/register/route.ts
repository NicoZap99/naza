import { NextResponse } from 'next/server';
import { users, User } from '../users';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }

  const exists = users.find(user => user.email === email);
  if (exists) {
    return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 });
  }

  users.push({ name, email, password });

  return NextResponse.json({ success: true });
}
