'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR
const Map = dynamic(
  () => import('./map'),
  { 
    loading: () => <div className="text-white text-center">Cargando mapa...</div>,
    ssr: false // This is important - it prevents server-side rendering
  }
);

export default function UbicacionPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only run geolocation code on the client
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watch = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
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
        {!isClient ? (
          <div className="text-white text-center">Cargando...</div>
        ) : position ? (
          <Map position={position} />
        ) : (
          <div className="text-white text-center">Obteniendo ubicación...</div>
        )}
      </div>
    </div>
  );
}
