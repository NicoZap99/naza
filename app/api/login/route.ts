import { NextResponse } from 'next/server';
import { users } from '../users';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  return NextResponse.json({ success: true, token: 'fake-jwt-token', name: user.name });
}