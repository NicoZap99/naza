'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { AtSymbolIcon, KeyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Button } from './button';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Guardamos el token si tu API lo devuelve
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Error en el login');
      }
    } catch (err) {
      setError('Error de red. Intenta de nuevo.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-black text-white p-8 rounded-xl shadow-lg border border-green-500"
    >
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 mb-4 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
          <img
            src="/nazaytu-logo.png"
            alt="Nazaytu Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h1 className={`${lusitana.className} text-2xl text-green-400`}>
          Inicia sesión
        </h1>
      </div>

      <label htmlFor="email" className="block text-sm text-green-300">
        Email
      </label>
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Tu correo"
          className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <AtSymbolIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-400" />
      </div>

      <label htmlFor="password" className="block text-sm text-green-300 mt-2">
        Contraseña
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Tu contraseña"
          className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <KeyIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-400" />
      </div>

      {error && <div className="text-red-400 text-center">{error}</div>}

      <div className="flex flex-col items-center gap-2">
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <ArrowRightIcon className="h-5 w-5" />
          Ingresar
        </button>
        <Link
          href="/register"
          className="w-full text-center bg-green-900 hover:bg-green-800 text-green-300 font-semibold py-2 px-4 rounded transition"
        >
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </form>
  );
}
