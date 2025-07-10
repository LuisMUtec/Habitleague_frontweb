import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || '';

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Icono animado */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-r from-[#B59E7D] to-[#584738] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-16 h-16 text-[#F1EADA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#AAA396] rounded-full flex items-center justify-center animate-bounce">
                <span className="text-[#F1EADA] text-sm font-bold">?</span>
              </div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl font-bold text-[#584738] mb-4">
            Oops! 
            <span className="block text-4xl text-[#B59E7D] mt-2">404</span>
          </h1>

          {/* Mensaje personalizado */}
          {searchTerm ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#584738] mb-4">
                No encontramos "{searchTerm}"
              </h2>
              <p className="text-lg text-[#AAA396] mb-6">
                Lo sentimos, no pudimos encontrar resultados para tu búsqueda.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#584738] mb-4">
                Página no encontrada
              </h2>
              <p className="text-lg text-[#AAA396] mb-6">
                La página que buscas no existe o ha sido movida.
              </p>
            </div>
          )}

          {/* Sugerencias */}
          <div className="bg-[#F1EADA] rounded-2xl shadow-lg p-8 mb-8 border border-[#CEC1A8]">
            <h3 className="text-xl font-semibold text-[#584738] mb-4">
              ¿Qué puedes hacer?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#CEC1A8] rounded-lg">
                <div className="w-12 h-12 bg-[#B59E7D] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#F1EADA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#584738] mb-2">Ir al Dashboard</h4>
                <p className="text-sm text-[#AAA396]">Regresa a tu página principal</p>
              </div>
              
              <div className="text-center p-4 bg-[#CEC1A8] rounded-lg">
                <div className="w-12 h-12 bg-[#B59E7D] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#F1EADA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#584738] mb-2">Explorar Challenges</h4>
                <p className="text-sm text-[#AAA396]">Descubre nuevos retos</p>
              </div>
              
              <div className="text-center p-4 bg-[#CEC1A8] rounded-lg">
                <div className="w-12 h-12 bg-[#B59E7D] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#F1EADA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-medium text-[#584738] mb-2">Contactar Soporte</h4>
                <p className="text-sm text-[#AAA396]">Si necesitas ayuda</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-[#B59E7D] text-[#F1EADA] rounded-xl font-medium hover:bg-[#584738] transition-colors shadow-lg hover:shadow-xl"
            >
              🏠 Ir al Dashboard
            </button>
            
            <button
              onClick={() => navigate('/challenges')}
              className="px-8 py-3 bg-[#AAA396] text-[#F1EADA] rounded-xl font-medium hover:bg-[#584738] transition-colors shadow-lg hover:shadow-xl"
            >
              🎯 Explorar Challenges
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-[#CEC1A8] text-[#584738] rounded-xl font-medium hover:bg-[#AAA396] transition-colors shadow-lg hover:shadow-xl"
            >
              ⬅️ Volver Atrás
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center">
            <p className="text-[#AAA396] text-sm">
              ¿Encontraste un enlace roto? 
              <button 
                onClick={() => navigate('/profile')}
                className="text-[#B59E7D] hover:text-[#584738] underline ml-1"
              >
                Contáctanos
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage; 