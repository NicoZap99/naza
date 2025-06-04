import LoginForm from '../ui/login-form';

export default function LoginPage() {
  return (
     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-4">
      {/* Capa negra semitransparente para oscurecer */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}