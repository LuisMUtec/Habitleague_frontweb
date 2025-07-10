import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';     // ⬅️  usa el hook del contexto
import Loading from '../components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/',
}) => {
  const {
    state: { isAuthenticated, loading },
  } = useAuth();
  const location = useLocation();

  /* Mientras comprobamos el token → spinner */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Verifying authentication…" />
      </div>
    );
  }

  /* Ruta protegida y usuario NO autenticado */
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  /* Ruta pública (login/registro) y usuario YA autenticado */
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  /* Caso válido → renderiza contenido */
  return <>{children}</>;
};

export default ProtectedRoute;
