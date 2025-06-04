'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para el icono de marker en Leaflet + Next.js
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function UbicacionPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
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
        {position ? (
          <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                ¡Estás aquí!
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="text-white text-center">Obteniendo ubicación...</div>
        )}
      </div>
    </div>
  );
}