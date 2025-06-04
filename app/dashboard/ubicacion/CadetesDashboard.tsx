import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";

type Cadete = {
  nombre: string;
  activo: boolean;
};

type Pedido = {
  id: number;
  origen: string;
  destino: string;
  estado: string;
  cadete: string;
};

type Props = {
  cadetes: Cadete[];
  pedidos: Pedido[];
  setCadeteChat: (nombre: string | null) => void;
};

export function CadetesDashboard({ cadetes, setCadeteChat }: Props) {
  const activos = cadetes.filter((c) => c.activo);

  return (
    <aside className="bg-white rounded-2xl shadow-lg p-4 h-[340px] overflow-y-auto min-w-[260px]">
      <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
        <UserIcon className="h-6 w-6" /> Cadetes activos
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {activos.length === 0 && (
          <div className="col-span-full text-gray-400 italic">
            No hay cadetes activos.
          </div>
        )}
        {activos.map((cadete) => (
          <div
            key={cadete.nombre}
            className="bg-gradient-to-br from-green-200 via-green-100 to-white rounded-xl shadow flex items-center gap-4 p-3 border border-green-300"
          >
            <UserIcon className="h-8 w-8 text-green-700 flex-shrink-0" />
            <div>
              <div className="font-bold text-green-900">{cadete.nombre}</div>
              <div className="text-xs text-green-700">Activo</div>
            </div>
            <span className="ml-auto text-green-600 text-2xl animate-pulse">
              ●
            </span>
            <button
              className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
              onClick={() => setCadeteChat(cadete.nombre)}
            >
              Chat
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

// Ejemplo de DashboardPage con pedidos y cadetes activos
export default function DashboardPage() {
  const [cadeteChat, setCadeteChat] = useState<string | null>(null);

  const cadetes = [
    { nombre: "Juan", activo: true },
    { nombre: "Ana", activo: false },
    { nombre: "Luis", activo: true },
  ];

  const pedidos = [
    { id: 1, origen: "Centro", destino: "Barrio Norte", estado: "En curso", cadete: "Juan" },
    { id: 2, origen: "Nueva Córdoba", destino: "General Paz", estado: "Pendiente", cadete: "Luis" },
    { id: 3, origen: "Alberdi", destino: "Cerro", estado: "Entregado", cadete: "Ana" },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna principal: Pedidos */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Pedidos</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-green-800">
                  <th>ID</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Cadete</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b last:border-b-0">
                    <td>{pedido.id}</td>
                    <td>{pedido.origen}</td>
                    <td>{pedido.destino}</td>
                    <td>{pedido.cadete}</td>
                    <td>
                      <span
                        className={
                          pedido.estado === "En curso"
                            ? "text-yellow-600 font-semibold"
                            : pedido.estado === "Pendiente"
                            ? "text-blue-600 font-semibold"
                            : "text-green-700 font-semibold"
                        }
                      >
                        {pedido.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Lateral: Cadetes activos */}
        <CadetesDashboard cadetes={cadetes} setCadeteChat={setCadeteChat} pedidos={pedidos} />
      </div>

      {/* Modal de chat */}
      {cadeteChat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-green-700">
                Chat con {cadeteChat}
              </h2>
              <button
                onClick={() => setCadeteChat(null)}
                className="text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>
            <div className="mb-4 h-40 overflow-y-auto border rounded p-2 bg-gray-50 text-sm text-gray-700">
              <div className="mb-2">
                [Simulación] Hola {cadeteChat}, ¿cómo va la entrega?
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // lógica enviar mensaje
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 border rounded p-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
