import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, BrainCircuit } from 'lucide-react';
import API_URL from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend sedang berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="btn-icon mb-3" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white' }}>
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-2xl font-bold">Masuk ke ISTIQ-MATH</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Lanjutkan perjalanan belajarmu!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm font-medium" style={{ backgroundColor: 'var(--danger-light)', color: '#b91c1c', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              className="input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Memuat...' : <><LogIn size={16} /> Masuk</>}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--primary)' }}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
