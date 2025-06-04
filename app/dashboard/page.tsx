'use client';

import { UserIcon, TruckIcon, PhoneIcon, MapIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CadetesDashboard } from './ubicacion/CadetesDashboard';
import ReactDOM from "react-dom";

// Importa el mapa de forma dinámica (solo cliente)
const Map = dynamic(() => import('./ubicacion/map'), {
  ssr: false,
  loading: () => <div className="text-green-700 text-center">Cargando mapa...</div>,
});

// Tipos para pedidos y cadetes
type Pedido = {
  id: number;
  origen: string;
  destino: string;
  estado: 'En curso' | 'Pendiente' | 'Entregado';
  cadete: string;
  coords: [number, number];
};

type Cadete = {
  nombre: string;
  activo: boolean;
  coords: [number, number];
};

// Datos simulados iniciales
const pedidosIniciales: Pedido[] = [
  { id: 1, origen: 'Centro', destino: 'Barrio Norte', estado: 'En curso', cadete: 'Juan', coords: [-31.4167, -64.1833] },
  { id: 2, origen: 'Nueva Córdoba', destino: 'General Paz', estado: 'Pendiente', cadete: 'María', coords: [-31.4201, -64.1888] },
  { id: 3, origen: 'Alberdi', destino: 'Cerro', estado: 'Entregado', cadete: 'Pedro', coords: [-31.4311, -64.1913] },
];

const cadetesIniciales: Cadete[] = [
  { nombre: 'Juan', activo: true, coords: [-31.4167, -64.1833] },
  { nombre: 'María', activo: true, coords: [-31.4201, -64.1888] },
  { nombre: 'Pedro', activo: false, coords: [-31.4311, -64.1913] },
];

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [cadetes, setCadetes] = useState(cadetesIniciales);

  // Para el mapa, mostramos la ubicación del primer pedido activo
  const pedidoActivo = pedidos.find(p => p.estado === 'En curso' || p.estado === 'Pendiente');
  const posicionMapa = pedidoActivo ? pedidoActivo.coords : [-31.4167, -64.1833];

  const cadetesActivos = cadetes.filter(c => c.activo).length;
  const pedidosEnCurso = pedidos.filter(p => p.estado === 'En curso').length;
  const operadoresActivos = 2; // Simulado

  // Estado para mostrar/ocultar formularios
  const [openForm, setOpenForm] = useState<string | null>(null);

  // Estado para el chat del cadete
  const [cadeteChat, setCadeteChat] = useState<string | null>(null);

  // --- Formulario para agregar pedido ---
  function handleAgregarPedido(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const origen = (form.elements.namedItem('origen') as HTMLInputElement).value;
    const destino = (form.elements.namedItem('destino') as HTMLInputElement).value;
    const cadete = (form.elements.namedItem('cadete') as HTMLSelectElement).value;
    // Coordenadas simuladas (puedes pedirlas en el form si quieres)
    const coords = [-31.42 + Math.random() * 0.02, -64.18 + Math.random() * 0.02] as [number, number];
    setPedidos([
      ...pedidos,
      {
        id: pedidos.length + 1,
        origen,
        destino,
        estado: 'Pendiente',
        cadete,
        coords,
      },
    ]);
    form.reset();
  }

  // --- Formulario para agregar cadete ---
  function handleAgregarCadete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
    const coords = [-31.42 + Math.random() * 0.02, -64.18 + Math.random() * 0.02] as [number, number];
    setCadetes([
      ...cadetes,
      {
        nombre,
        activo: true,
        coords,
      },
    ]);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-green-800 p-8">
      <h1 className="text-3xl font-bold mb-8 text-green-400 drop-shadow">Panel de Cadetería</h1>

      {/* Barra superior de acciones */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded font-semibold ${openForm === 'agregarPedido' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-700'}`}
          onClick={() => setOpenForm(openForm === 'agregarPedido' ? null : 'agregarPedido')}
        >
          Agregar pedido
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${openForm === 'actualizarEstado' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-700'}`}
          onClick={() => setOpenForm(openForm === 'actualizarEstado' ? null : 'actualizarEstado')}
        >
          Actualizar estado de pedido
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${openForm === 'agregarCadete' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-700'}`}
          onClick={() => setOpenForm(openForm === 'agregarCadete' ? null : 'agregarCadete')}
        >
          Agregar cadete
        </button>
      </div>

      {/* Formularios desplegables */}
      <div className="mb-8">
        {openForm === 'agregarPedido' && (
          <form onSubmit={handleAgregarPedido} className="bg-white rounded-2xl shadow-lg p-4 max-w-sm flex flex-col gap-2 mb-4">
            <h2 className="text-lg font-bold text-green-700 mb-2">Agregar pedido</h2>
            <input name="origen" required placeholder="Origen" className="p-2 rounded border border-green-300" />
            <input name="destino" required placeholder="Destino" className="p-2 rounded border border-green-300" />
            <select name="cadete" required className="p-2 rounded border border-green-300">
              <option value="">Asignar a cadete</option>
              {cadetes.map(c => (
                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            <button type="submit" className="bg-green-700 text-white rounded p-2 mt-2 hover:bg-green-800">
              Agregar pedido
            </button>
          </form>
        )}
        {openForm === 'actualizarEstado' && (
          <form
            onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const id = Number((form.elements.namedItem('pedidoId') as HTMLSelectElement).value);
              const estado = (form.elements.namedItem('estado') as HTMLSelectElement).value;
              setPedidos(pedidos =>
                pedidos.map(p =>
                  p.id === id ? { ...p, estado: estado as Pedido['estado'] } : p
                )
              );
              form.reset();
            }}
            className="bg-white rounded-2xl shadow-lg p-4 max-w-sm flex flex-col gap-2 mb-4"
          >
            <h2 className="text-lg font-bold text-green-700 mb-2">Actualizar estado de pedido</h2>
            <select name="pedidoId" required className="p-2 rounded border border-green-300">
              <option value="">Selecciona un pedido</option>
              {pedidos.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} - {p.origen} → {p.destino}
                </option>
              ))}
            </select>
            <select name="estado" required className="p-2 rounded border border-green-300">
              <option value="">Nuevo estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En curso">En curso</option>
              <option value="Entregado">Entregado</option>
            </select>
            <button type="submit" className="bg-green-700 text-white rounded p-2 mt-2 hover:bg-green-800">
              Actualizar estado
            </button>
          </form>
        )}
        {openForm === 'agregarCadete' && (
          <form onSubmit={handleAgregarCadete} className="bg-white rounded-2xl shadow-lg p-4 max-w-sm flex flex-col gap-2 mb-4">
            <h2 className="text-lg font-bold text-green-700 mb-2">Agregar cadete</h2>
            <input name="nombre" required placeholder="Nombre del cadete" className="p-2 rounded border border-green-300" />
            <button type="submit" className="bg-green-700 text-white rounded p-2 mt-2 hover:bg-green-800">
              Agregar cadete
            </button>
          </form>
        )}
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
          <UserIcon className="h-10 w-10 text-green-700 mb-2" />
          <h3 className="text-lg font-semibold mb-1 text-green-700">Cadetes activos</h3>
          <p className="text-3xl font-bold text-black">{cadetesActivos}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
          <TruckIcon className="h-10 w-10 text-green-700 mb-2" />
          <h3 className="text-lg font-semibold mb-1 text-green-700">Pedidos en curso</h3>
          <p className="text-3xl font-bold text-black">{pedidosEnCurso}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
          <PhoneIcon className="h-10 w-10 text-green-700 mb-2" />
          <h3 className="text-lg font-semibold mb-1 text-green-700">Operadores activos</h3>
          <p className="text-3xl font-bold text-black">{operadoresActivos}</p>
        </div>
      </div>

      {/* Estructura principal: Mapa y barra lateral de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna principal: Mapa y formularios */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              <MapIcon className="h-6 w-6" /> Mapa de cadetes y pedidos
            </h2>
            <div className="w-full h-[340px] rounded-lg overflow-hidden">
              <Map position={posicionMapa as [number, number]} cadetes={cadetes} pedidos={pedidos} />
            </div>
          </div>
          {/* Puedes agregar aquí otros componentes, como formularios o estadísticas */}
        </div>

        {/* Lateral: Cadetes activos */}
        <CadetesDashboard cadetes={cadetes} pedidos={pedidos} setCadeteChat={setCadeteChat} />
      </div>

      {/* Chat del cadete (ejemplo de uso de portal) */}
      {cadeteChat &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-green-700">Chat con {cadeteChat}</h2>
                <button
                  onClick={() => setCadeteChat(null)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4 h-40 overflow-y-auto border rounded p-2 bg-gray-50 text-sm text-gray-700">
                <div className="mb-2">[Simulación] Hola {cadeteChat}, ¿cómo va la entrega?</div>
                {/* Aquí puedes agregar mensajes reales si lo deseas */}
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  // Aquí puedes manejar el envío del mensaje
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border rounded p-2"
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Enviar
                </button>
              </form>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
}