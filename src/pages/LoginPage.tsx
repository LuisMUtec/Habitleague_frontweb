import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import heroImg from '../assets/hero.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login({ email, password });
      /* No navegamos aquí: el useEffect hará la redirección cuando
         state.isAuthenticated cambie a true */
    } catch (e: any) {
      // Error handling is done in LoginForm component
      throw e;
    }
  };

  /* 👉 Redirige SOLO cuando la autenticación ya está confirmada */
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Encabezado */}
      <header className="text-center mb-16">
        <p className="text-base font-semibold tracking-wide text-[#141414] uppercase">
          Habit League
        </p>
        <h1 className="mt-2 text-4xl md:text-[40px] font-extrabold text-[#141414]">
          Build better habits together
        </h1>
      </header>

      {/* Formulario + ilustración */}
      <section className="grid w-full max-w-6xl gap-16 md:grid-cols-2 items-start">
        <div className="flex justify-end">
          <LoginForm onSubmit={handleSubmit} />
        </div>

        <div className="hidden md:flex justify-center">
          <img
            src={heroImg}
            alt="Mountain with flag"
            className="h-[320px] w-auto object-contain select-none"
            draggable={false}
          />
        </div>
      </section>

      {/* Enlace de registro */}
      <p className="mt-10 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="font-medium underline text-[#141414]"
        >
          Sign up
        </button>
      </p>
    </main>
  );
};

export default LoginPage;
