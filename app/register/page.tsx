'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push('/login'); // Si registró bien, te lleva a login
    } else {
      const data = await res.json();
      setError(data.error || 'Error al registrarse');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      <h1 className="text-2xl font-bold text-center">Registrarse</h1>

      <div>
        <label className="block text-sm">Nombre</label>
        <input name="name" type="text" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input name="email" type="email" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm">Contraseña</label>
        <input name="password" type="password" required className="w-full border p-2 rounded" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Crear cuenta</button>
    </form>
  );
}

