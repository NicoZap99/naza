import { UserIcon, CurrencyDollarIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-green-800 flex flex-col">
      {/* Navbar superior */}
      <nav className="w-full bg-green-700 text-white flex items-center px-6 py-4 shadow-lg">
        <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center mr-4 overflow-hidden">
          <img
            src="/nazaytu-logo.png"
            alt="Nazaytu Marketing Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold flex-1">NazayTU</h2>
        <div className="flex gap-4">
          <a href="#" className="hover:bg-green-800 rounded px-3 py-2 transition">Inicio</a>
          <a href="#" className="hover:bg-green-800 rounded px-3 py-2 transition">Usuarios</a>
          <a href="#" className="hover:bg-green-800 rounded px-3 py-2 transition">Reportes</a>
        </div>
  <div>
      <Link
        href="/dashboard/ubicacion"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        Ir a Ubicación
      </Link>
    </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-green-400 drop-shadow">¡Bienvenido a NazayTU!</h1>
        {/* Tarjetas */}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
            <UserIcon className="h-10 w-10 text-green-700 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-green-700">Usuarios</h3>
            <p className="text-3xl font-bold text-black">120</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
            <CurrencyDollarIcon className="h-10 w-10 text-green-700 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-green-700">Ventas</h3>
            <p className="text-3xl font-bold text-black">$5,000</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
            <DocumentChartBarIcon className="h-10 w-10 text-green-700 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-green-700">Reportes</h3>
            <p className="text-3xl font-bold text-black">8</p>
          </div>
        </div>
      </main>
    </div>
  );
}