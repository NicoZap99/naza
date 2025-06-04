// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === 'nicolas@demo.com' && password === '123456') {
    // Simulamos un token JWT
    const token = 'fake-jwt-token-nicolas';
    return NextResponse.json({ token }, { status: 200 });
  }

  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
}

