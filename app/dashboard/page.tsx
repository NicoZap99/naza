'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from "next/image";
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

// Tipos y datos iniciales
type Pedido = {
  id: number;
  origen: string;
  destino: string;
  estado: 'En curso' | 'Pendiente' | 'Entregado';
  cadete: string;
  descripcion?: string;
  telefono: string;
  coords: [number, number];
};

type Cadete = {
  nombre: string;
  activo: boolean;
  coords: [number, number];
};

const pedidosIniciales: Pedido[] = [
  { id: 1, origen: 'Centro', destino: 'Barrio Norte', estado: 'En curso', cadete: 'Juan', descripcion: 'Entrega urgente', telefono: '5493446668827', coords: [-33.0096, -58.5172] },
  { id: 2, origen: 'Puerto', destino: 'Parque Unzué', estado: 'Pendiente', cadete: 'María', descripcion: '', telefono: '5493446668827', coords: [-33.0030, -58.5120] },
  { id: 3, origen: 'Costanera', destino: 'Terminal', estado: 'Entregado', cadete: 'Pedro', descripcion: '', telefono: '5493446668827', coords: [-33.0135, -58.5280] },
];

const cadetesIniciales: Cadete[] = [
  { nombre: 'Juan', activo: true, coords: [-33.0096, -58.5172] },
  { nombre: 'María', activo: true, coords: [-33.0030, -58.5120] },
  { nombre: 'Pedro', activo: false, coords: [-33.0135, -58.5280] },
];

// Mapa dinámico (simulado)
const Map = dynamic(() => import('./ubicacion/map'), {
  ssr: false,
  loading: () => <div className="text-green-700 text-center">Cargando mapa...</div>,
});

// ChatCadetes optimizado y responsive
function ChatCadetes({ cadetes }: { cadetes: Cadete[] }) {
  const [busquedaCadete, setBusquedaCadete] = useState("");
  const [cadeteChat, setCadeteChat] = useState<string>("");
  const [mensajes, setMensajes] = useState<{ cadete: string; texto: string; de: "yo" | "cadete" }[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const cadetesFiltrados = cadetes.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaCadete.toLowerCase())
  );
  const mensajesCadete = mensajes.filter((m) => m.cadete === cadeteChat);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje || !cadeteChat) return;
    setMensajes([
      ...mensajes,
      { cadete: cadeteChat, texto: nuevoMensaje, de: "yo" },
    ]);
    setNuevoMensaje("");
    setTimeout(() => {
      setMensajes((msgs) => [
        ...msgs,
        { cadete: cadeteChat, texto: "¡Recibido!", de: "cadete" },
      ]);
    }, 800);
  };

  return (
    <div className="flex bg-white/80 rounded-xl shadow overflow-hidden w-full h-full min-h-[180px] sm:w-[350px] sm:h-[340px]">
      {/* Barra lateral de cadetes */}
      <aside className="w-24 sm:w-32 bg-green-900/90 flex flex-col p-2">
        <input
          type="text"
          className="border rounded p-2 mb-2 text-sm text-green-900 bg-white"
          placeholder="Buscar cadete..."
          value={busquedaCadete}
          onChange={e => setBusquedaCadete(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto">
          {cadetesFiltrados.length === 0 && (
            <div className="text-green-100 text-center mt-4 text-xs">No hay cadetes</div>
          )}
          {cadetesFiltrados.map((c) => (
            <button
              key={c.nombre}
              className={`w-full text-left px-2 py-1 rounded mb-1 text-sm transition-colors ${
                cadeteChat === c.nombre
                  ? "bg-green-600 text-white"
                  : "bg-green-100 hover:bg-green-200 text-green-900"
              }`}
              onClick={() => setCadeteChat(c.nombre)}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      </aside>
      {/* Chat principal */}
      <section className="flex-1 flex flex-col p-2">
        <h3 className="text-green-700 font-bold mb-1 text-center text-sm">Chat con cadetes</h3>
        <div className="flex-1 h-32 overflow-y-auto bg-green-50 rounded p-1 mb-1 border border-green-200 text-xs">
          {(!cadeteChat || mensajesCadete.length === 0) && (
            <div className="text-gray-400 text-center mt-4">No hay mensajes</div>
          )}
          {mensajesCadete.map((m, i) => (
            <div
              key={i}
              className={`mb-1 flex ${m.de === "yo" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`px-2 py-1 rounded-lg text-xs ${
                  m.de === "yo"
                    ? "bg-green-600 text-white"
                    : "bg-green-200 text-green-900"
                }`}
              >
                {m.texto}
              </span>
            </div>
          ))}
        </div>
        <form className="flex gap-1" onSubmit={handleEnviar}>
          <input
            type="text"
            className="border rounded p-1 flex-1 text-xs text-green-900 bg-white"
            placeholder="Escribe un mensaje..."
            value={nuevoMensaje}
            onChange={e => setNuevoMensaje(e.target.value)}
            disabled={!cadeteChat}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-2 py-1 rounded text-xs transition-colors"
            disabled={!cadeteChat || !nuevoMensaje}
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  );
}

// Función para abrir WhatsApp Web
function enviarWhatsApp(numero: string, mensaje: string) {
  // El número debe ser en formato internacional, ej: 5493446668827 (sin + ni espacios)
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [cadetes, setCadetes] = useState<Cadete[]>(cadetesIniciales);

  // Modales
  const [modal, setModal] = useState<string | null>(null);
  const [nuevoPedido, setNuevoPedido] = useState({ origen: '', destino: '', cadete: '', descripcion: '', telefono: '' });
  const [nuevoCadete, setNuevoCadete] = useState('');
  const [pedidoActualizar, setPedidoActualizar] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');

  // Estadísticas
  const cadetesActivos = cadetes.filter(c => c.activo).length;
  const pedidoActivo = pedidos.find(p => p.estado === 'En curso' || p.estado === 'Pendiente');
  const posicionMapa = pedidoActivo ? pedidoActivo.coords : [-33.0096, -58.5172];

  // Handlers para los modales
  function handleAgregarPedido(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoPedido.origen || !nuevoPedido.destino || !nuevoPedido.cadete || !nuevoPedido.telefono) return;
    setPedidos([
      ...pedidos,
      {
        id: pedidos.length + 1,
        origen: nuevoPedido.origen,
        destino: nuevoPedido.destino,
        estado: 'Pendiente',
        cadete: nuevoPedido.cadete,
        descripcion: nuevoPedido.descripcion,
        telefono: nuevoPedido.telefono,
        coords: [-33.01 + Math.random() * 0.01, -58.51 + Math.random() * 0.01],
      }
    ]);
    setNuevoPedido({ origen: '', destino: '', cadete: '', descripcion: '', telefono: '' });
    setModal(null);
  }

  function handleAgregarCadete(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoCadete) return;
    setCadetes([
      ...cadetes,
      {
        nombre: nuevoCadete,
        activo: true,
        coords: [-33.01 + Math.random() * 0.01, -58.51 + Math.random() * 0.01],
      }
    ]);
    setNuevoCadete('');
    setModal(null);
  }

  function handleActualizarPedido(e: React.FormEvent) {
    e.preventDefault();
    if (!pedidoActualizar || !nuevoEstado) return;

    const pedidoPrevio = pedidos.find(p => p.id === Number(pedidoActualizar));
    setPedidos(pedidos.map(p =>
      p.id === Number(pedidoActualizar)
        ? { ...p, estado: nuevoEstado as Pedido['estado'] }
        : p
    ));

    // Si pasa a "En curso", abrir WhatsApp Web
    if (
      nuevoEstado === "En curso" &&
      pedidoPrevio?.estado !== "En curso" &&
      pedidoPrevio?.telefono
    ) {
      enviarWhatsApp(
        pedidoPrevio.telefono,
        `¡Hola! Tu pedido #${pedidoPrevio.id} está en curso. Pronto será entregado.`
      );
    }

    setPedidoActualizar('');
    setNuevoEstado('');
    setModal(null);
  }

  return (
    <div className="min-h-screen transition-colors duration-300
      bg-gradient-to-br from-black via-green-950 to-green-800
      text-green-100 p-2 sm:p-8"
    >
      {/* Navbar estética y responsive */}
      <nav className="w-full flex flex-col sm:flex-row items-center justify-between px-2 sm:px-8 py-3 bg-green-900/80 shadow-2xl backdrop-blur-md rounded-b-2xl border-b border-green-700/30 fixed top-0 left-0 z-50 transition-all duration-300 gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Image
              src="/logo-naza.png"
              alt="Logo NAZA"
              width={36}
              height={36}
              className="rounded-full object-cover"
              style={{ minWidth: 36 }}
              priority
            />
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-green-200 tracking-wide drop-shadow-lg select-none">
            PANEL DE CADETERÍA
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className="bg-green-600/90 hover:bg-green-500 text-white font-semibold px-3 py-1 rounded-lg shadow transition-all duration-200 border border-green-700/20 hover:scale-105 text-xs sm:text-base"
            onClick={() => setModal('pedido')}
          >
            Agregar pedido
          </button>
          <button
            className="bg-yellow-500/90 hover:bg-yellow-400 text-white font-semibold px-3 py-1 rounded-lg shadow transition-all duration-200 border border-yellow-700/20 hover:scale-105 text-xs sm:text-base"
            onClick={() => setModal('actualizar')}
          >
            Actualizar pedido
          </button>
          <button
            className="bg-blue-600/90 hover:bg-blue-500 text-white font-semibold px-3 py-1 rounded-lg shadow transition-all duration-200 border border-blue-700/20 hover:scale-105 text-xs sm:text-base"
            onClick={() => setModal('cadete')}
          >
            Agregar cadete
          </button>
        </div>
      </nav>
      <div style={{ height: "110px" }} className="sm:h-[80px]" />

      {/* Modales */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setModal(null)}
              aria-label="Cerrar"
            >×</button>
            {modal === 'pedido' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-green-700">Agregar pedido</h2>
                <form className="flex flex-col gap-3" onSubmit={handleAgregarPedido}>
                  <input
                    type="text"
                    placeholder="Origen"
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoPedido.origen}
                    onChange={e => setNuevoPedido({ ...nuevoPedido, origen: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Destino"
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoPedido.destino}
                    onChange={e => setNuevoPedido({ ...nuevoPedido, destino: e.target.value })}
                  />
                  <select
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoPedido.cadete}
                    onChange={e => setNuevoPedido({ ...nuevoPedido, cadete: e.target.value })}
                  >
                    <option value="">Seleccionar cadete</option>
                    {cadetes.map(c => (
                      <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Teléfono del cliente (sin + ni 0)"
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoPedido.telefono}
                    onChange={e => setNuevoPedido({ ...nuevoPedido, telefono: e.target.value })}
                  />
                  <textarea
                    placeholder="Descripción (opcional)"
                    className="border rounded p-2 text-green-900 bg-white resize-none"
                    value={nuevoPedido.descripcion}
                    onChange={e => setNuevoPedido({ ...nuevoPedido, descripcion: e.target.value })}
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    Agregar
                  </button>
                </form>
              </div>
            )}
            {modal === 'actualizar' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-green-700">Actualizar pedido</h2>
                <form className="flex flex-col gap-3" onSubmit={handleActualizarPedido}>
                  <select
                    className="border rounded p-2 text-green-900 bg-white"
                    value={pedidoActualizar}
                    onChange={e => setPedidoActualizar(e.target.value)}
                  >
                    <option value="">Seleccionar pedido</option>
                    {pedidos.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.id} - {p.origen} → {p.destino}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoEstado}
                    onChange={e => setNuevoEstado(e.target.value)}
                  >
                    <option value="">Nuevo estado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En curso">En curso</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    Actualizar
                  </button>
                </form>
              </div>
            )}
            {modal === 'cadete' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-green-700">Agregar cadete</h2>
                <form className="flex flex-col gap-3" onSubmit={handleAgregarCadete}>
                  <input
                    type="text"
                    placeholder="Nombre del cadete"
                    className="border rounded p-2 text-green-900 bg-white"
                    value={nuevoCadete}
                    onChange={e => setNuevoCadete(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    Agregar
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard principal responsive */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 sm:gap-8 mt-16 mb-8 max-w-full md:max-w-6xl mx-auto px-1 sm:px-0">
        {/* Estadísticas y gráfica */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full md:w-auto">
          {/* Estadísticas */}
          <div className="flex flex-row sm:flex-col gap-4 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center bg-white/80 rounded-xl shadow p-4 min-w-[110px]">
              <span className="text-lg font-bold text-green-700">{pedidos.filter(p => p.estado === "Entregado").length}</span>
              <span className="text-xs text-green-800 text-center">Entregados</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/80 rounded-xl shadow p-4 min-w-[110px]">
              <span className="text-lg font-bold text-green-700">${pedidos.filter(p => p.estado === "Entregado").length * 1500}</span>
              <span className="text-xs text-green-800 text-center">Ganancia</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/80 rounded-xl shadow p-4 min-w-[110px]">
              <span className="text-lg font-bold text-green-700">{cadetesActivos}</span>
              <span className="text-xs text-green-800 text-center pl-2">Cadetes activos</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white/80 rounded-xl shadow p-4 min-w-[110px]">
              <span className="text-lg font-bold text-green-700">{pedidos.length}</span>
              <span className="text-xs text-green-800 text-center pl-2">Pedidos totales</span>
            </div>
          </div>
          {/* Gráfica */}
          <div className="bg-white/80 rounded-xl shadow p-4 sm:p-6 flex flex-col items-center w-full max-w-xs min-w-[180px] h-[260px] sm:h-[340px]">
            <h3 className="text-center text-green-700 font-bold mb-2 sm:mb-4 text-base sm:text-lg">Estado de pedidos</h3>
            <div className="w-36 h-36 sm:w-56 sm:h-56 flex items-center justify-center">
              <Pie
                data={{
                  labels: ['Entregados', 'En curso', 'Pendientes'],
                  datasets: [{
                    data: [
                      pedidos.filter(p => p.estado === "Entregado").length,
                      pedidos.filter(p => p.estado === "En curso").length,
                      pedidos.filter(p => p.estado === "Pendiente").length,
                    ],
                    backgroundColor: ['#22c55e', '#facc15', '#38bdf8'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  plugins: {
                    legend: { display: true, position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* Chat alineado y responsive */}
        <div className="w-full sm:w-[350px] h-[260px] sm:h-[340px]">
          <ChatCadetes cadetes={cadetes} />
        </div>
      </div>

      {/* Mapa y pedidos recientes en fila */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-full lg:max-w-6xl mx-auto mt-8">
        {/* Mapa */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-green-200 via-white to-green-100 rounded-2xl shadow-xl p-2 sm:p-6 border border-green-300 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in w-full h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 border-b-2 border-green-400 pb-2 mb-4 flex items-center gap-2">
              Mapa de cadetes y pedidos
            </h2>
            <div className="w-full h-[180px] sm:h-[340px] rounded-lg overflow-hidden border border-green-900/20">
              <Map
                position={posicionMapa as [number, number]}
                cadetes={cadetes}
                pedidos={pedidos}
              />
            </div>
          </div>
        </div>
        {/* Pedidos recientes */}
        <div className="w-full lg:w-[420px] flex flex-col h-full">
          <div className="bg-white/80 rounded-xl shadow p-4 flex flex-col h-full">
            <h2 className="text-lg font-bold text-green-700 mb-4">Pedidos recientes</h2>
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2 text-green-900">#</th>
                    <th className="py-2 px-2 text-green-900">Origen</th>
                    <th className="py-2 px-2 text-green-900">Destino</th>
                    <th className="py-2 px-2 text-green-900">Cadete</th>
                    <th className="py-2 px-2 text-green-900">Estado</th>
                    <th className="py-2 px-2 text-green-900">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {[...pedidos].reverse().slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td className="py-2 px-2 font-bold text-green-900">#{p.id}</td>
                      <td className="py-2 px-2 text-green-900">{p.origen}</td>
                      <td className="py-2 px-2 text-green-900">{p.destino}</td>
                      <td className="py-2 px-2 text-green-900">{p.cadete}</td>
                      <td className="py-2 px-2">
                        <span className={
                          p.estado === 'Entregado'
                            ? 'bg-green-200 text-green-800 px-2 py-1 rounded'
                            : p.estado === 'En curso'
                            ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded'
                            : 'bg-blue-100 text-blue-800 px-2 py-1 rounded'
                        }>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-green-900">{p.descripcion || <span className="text-gray-400">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Barra final */}
            <div className="border-b border-green-300 mt-2 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}


