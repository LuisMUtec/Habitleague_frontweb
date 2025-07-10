import React, { type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

import maleAvatar   from '../../assets/MALE.png';
import femaleAvatar from '../../assets/FEMALE.png';

/* ---------- Tipos ---------- */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePhotoUrl: string;
  avatarId: string;
}

interface RegisterFormProps {
  step: 1 | 2;
  formData: RegisterFormData;
  setFormData: Dispatch<SetStateAction<RegisterFormData>>;
  onStepChange: (step: 1 | 2) => void;
}

/* ---------- Componente ---------- */
const RegisterForm: React.FC<RegisterFormProps> = ({
  step,
  formData,
  setFormData,
  onStepChange,
}) => {
  const { register, logout } = useAuth();
  const navigate = useNavigate();

  const [error,   setError]   = React.useState('');
  const [loading, setLoading] = React.useState(false);

  /* ---------- helpers ---------- */
  const onChange = (field: keyof RegisterFormData, value: string) => {
    setError('');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    if (
      !formData.email ||
      !formData.password ||
      formData.password !== formData.confirmPassword
    ) {
      setError('Please fill and match all fields');
      return;
    }
    onStepChange(2);
  };

  const submit = async () => {
    setError('');

    if (!formData.firstName || !formData.lastName) {
      setError('First & last name required');
      return;
    }
    if (!formData.avatarId) {
      setError('You must select an avatar');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        firstName: formData.firstName.trim(),
        lastName:  formData.lastName.trim(),
        email:     formData.email.trim(),
        password:  formData.password,
        bio:       formData.bio.trim(),
        avatarId:  formData.avatarId,
      };
      if (formData.profilePhotoUrl.trim()) {
        payload.profilePhotoUrl = formData.profilePhotoUrl.trim();
      }

      await register(payload);   // 1️⃣
      logout();                  // 2️⃣
      navigate('/');             // 3️⃣
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  const isStep1 = step === 1;

  return (
    <div className={`space-y-8 ${isStep1 ? 'w-full max-w-md mx-auto' : ''}`}>
      {/* Encabezados */}
      <p
        className={`text-xs text-gray-500 uppercase tracking-wide ${
          isStep1 ? 'text-center' : ''
        }`}
      >
        Step {step} of 2
      </p>

      <h2
        className={`text-3xl font-bold text-gray-800 ${
          isStep1 ? 'text-center' : ''
        }`}
      >
        {isStep1 ? 'Create your account' : 'Profile information'}
      </h2>

      {error && (
        <p className={`text-sm text-red-600 ${isStep1 ? 'text-center' : ''}`}>
          {error}
        </p>
      )}

      {/* ---------------- PASO 1 ---------------- */}
      {isStep1 ? (
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => onChange('email', e.target.value)}
              placeholder="Email"
              className="w-full h-12 px-4 rounded-xl bg-gray-200 placeholder-gray-500
                         border-0 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => onChange('password', e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 rounded-xl bg-gray-200 placeholder-gray-500
                         border-0 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => onChange('confirmPassword', e.target.value)}
              placeholder="Confirm Password"
              className="w-full h-12 px-4 rounded-xl bg-gray-200 placeholder-gray-500
                         border-0 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Botón negro */}
          <Button
            onClick={next}
            className="w-full h-12 !bg-black !text-white rounded-xl font-medium hover:!bg-gray-900"
          >
            Next
          </Button>
        </div>
      ) : (
      /* ---------------- PASO 2 (original) ---------------- */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* -------- Name, Bio, Photo -------- */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => onChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => onChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => onChange('bio', e.target.value)}
                  placeholder="Tell us about yourself…"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL (optional, &lt;255 chars)
                </label>
                <input
                  type="text"
                  value={formData.profilePhotoUrl}
                  onChange={e => onChange('profilePhotoUrl', e.target.value)}
                  placeholder="https://…"
                  className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* -------- Avatars -------- */}
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <p className="text-sm text-gray-600">Choose avatar</p>
              <div className="flex space-x-4">
                {/* Male */}
                <button
                  type="button"
                  onClick={() => onChange('avatarId', 'MALE')}
                  className={`w-16 h-16 rounded-full overflow-hidden border-4
                    ${formData.avatarId === 'MALE' ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={maleAvatar} alt="Male avatar"
                       className="object-cover w-full h-full" />
                </button>

                {/* Female */}
                <button
                  type="button"
                  onClick={() => onChange('avatarId', 'FEMALE')}
                  className={`w-16 h-16 rounded-full overflow-hidden border-4
                    ${formData.avatarId === 'FEMALE' ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={femaleAvatar} alt="Female avatar"
                       className="object-cover w-full h-full" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={submit}
              loading={loading}
              className="px-8 h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-900"
            >
              Create Account
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            Step 2 of 2
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
