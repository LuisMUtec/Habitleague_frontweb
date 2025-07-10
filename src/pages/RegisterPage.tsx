import React, { useState } from 'react';
import RegisterForm, { type RegisterFormData } from '../components/auth/RegisterForm';
import heroImg from '../assets/hero.png';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Estado único para TODO el formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bio: '',
    profilePhotoUrl: '',
    avatarId: '',
  });

  /* ============== PASO 1 ============== */
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        {/* ---------- Formulario ---------- */}
        <div className="flex-1 flex items-start justify-center pt-12 px-6 md:px-24">
          <RegisterForm
            step={step}
            formData={formData}
            setFormData={setFormData}
            onStepChange={setStep}
          />
        </div>

        {/* ---------- Ilustración (centrada verticalmente) ---------- */}
        <div className="hidden md:flex flex-1 items-center justify-center pr-8">
          <img
            src={heroImg}
            alt="Hero"
            className="w-72 md:w-96 lg:w-[420px] select-none"
          />
        </div>
      </div>
    );
  }

  /* ============== PASO 2 (tarjeta original) ============== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-12 flex justify-center">
          <RegisterForm
            step={step}
            formData={formData}
            setFormData={setFormData}
            onStepChange={setStep}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
