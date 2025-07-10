// src/router/AppRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage            from '../pages/LoginPage';
import RegisterPage         from '../pages/RegisterPage';
import DashboardPage        from '../pages/DashboardPage';
import ChallengesPage       from '../pages/ChallengesPage';
import ChallengeDetailPage  from '../pages/ChallengeDetailPage';
import PaymentsPage         from '../pages/PaymentsPage';
import ProfilePage          from '../pages/ProfilePage';
import EditProfilePage      from '../pages/EditProfilePage';
import EvidencesPage        from '../pages/EvidencesPage';
import SubmitEvidencePage   from '../pages/SubmitEvidencePage';
import EvidenceDetailPage   from '../pages/EvidenceDetailPage';
import NotFoundPage         from '../pages/NotFoundPage';

import ProtectedRoute       from './ProtectedRoute';

export const AppRouter: React.FC = () => (
  <Routes>
    {/* Redirige "/" a "/login" */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Rutas públicas */}
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Rutas protegidas */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/challenges"
      element={
        <ProtectedRoute>
          <ChallengesPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/challenges/:id"
      element={
        <ProtectedRoute>
          <ChallengeDetailPage />
        </ProtectedRoute>
      }
    />

    {/* Pagos */}
    <Route
      path="/payments"
      element={
        <ProtectedRoute>
          <PaymentsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />

    {/* Ruta de edición de perfil */}
    <Route
      path="/profile/edit"
      element={
        <ProtectedRoute>
          <EditProfilePage />
        </ProtectedRoute>
      }
    />

    {/* Evidencias */}
    <Route
      path="/evidences"
      element={
        <ProtectedRoute>
          <EvidencesPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/evidences/:evidenceId"
      element={
        <ProtectedRoute>
          <EvidenceDetailPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/evidences/submit"
      element={
        <ProtectedRoute>
          <SubmitEvidencePage />
        </ProtectedRoute>
      }
    />

    {/* 404 - Not Found Page */}
    <Route
      path="/not-found"
      element={
        <ProtectedRoute>
          <NotFoundPage />
        </ProtectedRoute>
      }
    />

    {/* Catch all - redirect to not found */}
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Routes>
);

export default AppRouter;
