import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import { apiService } from '../services/api';
import { API_CONFIG } from '../config/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/ui/Loading';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  firstName:       string;
  lastName:        string;
  email:           string;
  bio?:            string;
  profilePhotoUrl?: string | null;
  avatarId?:       string;
}

const EditProfilePage: React.FC = () => {
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada relativa al endpoint, proxy de Vite maneja /api → backend
    apiService
      .getJSON<UserProfile>(API_CONFIG.ENDPOINTS.GET_PROFILE)
      .then(data => setProfile(data))
      .catch(() => setError('No se pudo cargar tu perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      // Verificar si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
        return;
      }

      console.log('Token encontrado:', token.substring(0, 20) + '...');
      console.log('Enviando datos:', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profilePhotoUrl: profile.profilePhotoUrl,
        avatarId: profile.avatarId,
      });

      // PATCH al endpoint de perfil (como espera el backend)
      await apiService.patchJSON<UserProfile>(
        API_CONFIG.ENDPOINTS.UPDATE_PROFILE,
        {
          firstName:       profile.firstName,
          lastName:        profile.lastName,
          bio:             profile.bio,
          profilePhotoUrl: profile.profilePhotoUrl,
          avatarId:        profile.avatarId,
        }
      );

      // Actualizar el contexto de autenticación con los nuevos datos
      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profilePhotoUrl: profile.profilePhotoUrl || undefined,
        avatarId: profile.avatarId,
      });

      navigate('/profile');
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      setError(`Error guardando los cambios: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="profile" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={profile?.firstName || ''}
              onChange={e => handleChange('firstName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={profile?.lastName || ''}
              onChange={e => handleChange('lastName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          {/* Email (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              rows={3}
              value={profile?.bio || ''}
              onChange={e => handleChange('bio', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="text"
              value={profile?.profilePhotoUrl || ''}
              onChange={e => handleChange('profilePhotoUrl', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-black text-white rounded-md mt-4 disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProfilePage;
