'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMemo, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

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

type MapProps = {
  position: [number, number];
  cadetes?: Cadete[];
  pedidos?: Pedido[];
};

export default function Map({ position, cadetes = [], pedidos = [] }: MapProps) {
  // Fix para íconos rotos de Leaflet (solo en cliente)
  useEffect(() => {
    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  // Ícono por defecto para cadetes activos
  const defaultIcon = useMemo(() => {
    return new L.Icon.Default();
  }, []);

  // Ícono personalizado para cadetes inactivos
  const cadeteInactivoIcon = useMemo(() => L.icon({
    iconUrl: '/inactivo-icon.png',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  }), []);

  return (
    <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de cadetes */}
      {cadetes.map((cadete) => (
        <Marker
          key={cadete.nombre}
          position={cadete.coords}
          icon={cadete.activo ? defaultIcon : cadeteInactivoIcon}
        >
          <Popup>
            <strong>{cadete.nombre}</strong>
            <br />
            Estado: {cadete.activo ? 'Activo' : 'Inactivo'}
          </Popup>
        </Marker>
      ))}

      {/* Marcadores de pedidos */}
      {pedidos.map((pedido) => (
        <Marker key={pedido.id} position={pedido.coords}>
          <Popup>
            <strong>Pedido #{pedido.id}</strong>
            <br />
            {pedido.origen} → {pedido.destino}
            <br />
            Estado: {pedido.estado}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
