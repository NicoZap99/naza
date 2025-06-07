export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <input type="checkbox" id="chk" className="hidden" />

      <div className="login p-8 shadow-md">
        <label htmlFor="chk" className="block text-center cursor-pointer">
          Iniciar Sesión
        </label>
        <form className="mt-4">
          <input type="text" placeholder="Usuario" className="block w-full p-2 mb-2" />
          <input type="password" placeholder="Contraseña" className="block w-full p-2 mb-2" />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Entrar</button>
        </form>
      </div>
    </div>
  );
}