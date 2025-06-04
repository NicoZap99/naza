'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Tipos para los datos
type Cadete = {
  nombre: string;
  activo: boolean;
  coords: [number, number];
};
type Pedido = {
  id: number;
  origen: string;
  destino: string;
  estado: 'En curso' | 'Pendiente' | 'Entregado';
  cadete: string;
  coords: [number, number];
};

// Datos simulados
const cadetesEjemplo: Cadete[] = [
  { nombre: 'Juan', activo: true, coords: [-31.4167, -64.1833] },
  { nombre: 'María', activo: true, coords: [-31.4201, -64.1888] },
  { nombre: 'Pedro', activo: false, coords: [-31.4311, -64.1913] },
];
const pedidosEjemplo: Pedido[] = [
  { id: 1, origen: 'Centro', destino: 'Barrio Norte', estado: 'En curso', cadete: 'Juan', coords: [-31.4167, -64.1833] },
  { id: 2, origen: 'Nueva Córdoba', destino: 'General Paz', estado: 'Pendiente', cadete: 'María', coords: [-31.4201, -64.1888] },
];

// Dynamically import the Map component with no SSR
type MapProps = {
  position: [number, number];
  cadetes: Cadete[];
  pedidos: Pedido[];
};

const Map = dynamic(
  () => import('./map'),
  { 
    loading: () => <div className="text-white text-center">Cargando mapa...</div>,
    ssr: false // This is important - it prevents server-side rendering
  }
);

export default function UbicacionPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watch = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          alert('No se pudo obtener tu ubicación');
        }
      );
      return () => navigator.geolocation.clearWatch(watch);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-2xl text-green-400 mb-4 font-bold">Mi Ubicación en el Mapa</h1>
      <div className="w-full max-w-xl h-[400px] rounded-lg overflow-hidden shadow-lg">
        {position ? (
          <Map position={position} cadetes={cadetesEjemplo} pedidos={pedidosEjemplo} />
        ) : (
          <div className="text-white text-center">Obteniendo ubicación...</div>
        )}
      </div>
    </div>
  );
}
