import React, { useState } from 'react';
import Button from '../ui/Button';

interface Props {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="space-y-6 w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-[#141414]">Log in</h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#141414] mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full h-12 rounded-xl bg-[#e6e6e6] px-4 placeholder:text-neutral-500 focus:ring-0 border-none"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#141414] mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full h-12 rounded-xl bg-[#e6e6e6] px-4 placeholder:text-neutral-500 focus:ring-0 border-none"
        />
      </div>

      {/* Botón negro delgado, color forzado */}
      <Button
        loading={loading}
        /*  !bg-* y !text-* = importante → nunca se sobreescribe  */
        className="w-full h-10 rounded-xl !bg-black !text-white font-medium border-none hover:!bg-neutral-800 focus:!ring-neutral-800"
      >
        Log In
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default LoginForm;
