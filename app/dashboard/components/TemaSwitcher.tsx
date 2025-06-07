import { useEffect, useState } from "react";

export default function TemaSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  }, [dark]);

  useEffect(() => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "dark") setDark(true);
  }, []);

  return (
    <button
      className="ml-4 px-3 py-1 rounded bg-green-800 text-white hover:bg-green-700 transition-colors"
      onClick={() => setDark((v) => !v)}
      title="Cambiar tema"
    >
      {dark ? "🌙 Oscuro" : "☀️ Claro"}
    </button>
  );
}