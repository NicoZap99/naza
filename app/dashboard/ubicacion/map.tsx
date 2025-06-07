'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';
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
  // Icono personalizado para cadetes activos
  const cadeteIcon = useMemo(() => L.icon({
    iconUrl: '/icono-cadetes.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: undefined,
  }), []);

  // Icono personalizado para cadetes inactivos (opcional)
  const cadeteInactivoIcon = useMemo(() => L.icon({
    iconUrl: '/icono-cadetes-inactivo.png', // crea este icono si quieres
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: undefined,
  }), []);

  return (
    <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de cadetes */}
      {cadetes.map((cadete, idx) => {
        const offset = 0.0002 * idx;
        const coords = [
          cadete.coords[0] + offset,
          cadete.coords[1] + offset,
        ] as [number, number];

        return (
          <Marker
            key={cadete.nombre}
            position={coords}
            icon={cadete.activo ? cadeteIcon : cadeteInactivoIcon}
          >
            <Popup>
              <strong>{cadete.nombre}</strong>
              <br />
              Estado: {cadete.activo ? 'Activo' : 'Inactivo'}
            </Popup>
          </Marker>
        );
      })}

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
