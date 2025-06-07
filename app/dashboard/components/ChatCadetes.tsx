import { useState } from "react";

type Cadete = {
  nombre: string;
  activo: boolean;
  coords: [number, number];
};

type Mensaje = {
  cadete: string;
  texto: string;
  de: "yo" | "cadete";
};

interface ChatCadetesProps {
  cadetes: Cadete[];
}

export default function ChatCadetes({ cadetes }: ChatCadetesProps) {
  const [busquedaCadete, setBusquedaCadete] = useState("");
  const [cadeteChat, setCadeteChat] = useState<string>("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  // Filtra cadetes según la búsqueda
  const cadetesFiltrados = cadetes.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaCadete.toLowerCase())
  );

  // Mensajes del cadete seleccionado
  const mensajesCadete = mensajes.filter((m) => m.cadete === cadeteChat);

  // Enviar mensaje
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
    <div
      className="flex max-w-2xl mx-auto mt-12 mb-8 bg-white/80 rounded-xl shadow overflow-hidden"
      style={{ minHeight: 340, height: 340 }}
    >
      {/* Barra lateral de cadetes */}
      <aside className="w-48 bg-green-900/90 flex flex-col p-3">
        <input
          type="text"
          className="border rounded p-2 mb-2 text-sm"
          placeholder="Buscar cadete..."
          value={busquedaCadete}
          onChange={(e) => setBusquedaCadete(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 260 }}>
          {cadetesFiltrados.length === 0 && (
            <div className="text-green-100 text-center mt-8 text-xs">No hay cadetes</div>
          )}
          {cadetesFiltrados.map((c) => (
            <button
              key={c.nombre}
              className={`w-full text-left px-3 py-2 rounded mb-1 transition-colors ${
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
      <section className="flex-1 flex flex-col p-4">
        <h3 className="text-green-700 font-bold mb-2 text-lg text-center">Chat con cadetes</h3>
        <div className="flex-1 h-40 overflow-y-auto bg-green-50 rounded p-2 mb-2 border border-green-200">
          {(!cadeteChat || mensajesCadete.length === 0) && (
            <div className="text-gray-400 text-center mt-8">No hay mensajes</div>
          )}
          {mensajesCadete.map((m, i) => (
            <div
              key={i}
              className={`mb-2 flex ${m.de === "yo" ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`px-3 py-1 rounded-lg text-sm ${
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
        <form className="flex gap-2" onSubmit={handleEnviar}>
          <input
            type="text"
            className="border rounded p-2 flex-1"
            placeholder="Escribe un mensaje..."
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            disabled={!cadeteChat}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition-colors"
            disabled={!cadeteChat || !nuevoMensaje}
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  );
}