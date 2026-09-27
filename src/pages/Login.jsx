import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, BrainCircuit } from 'lucide-react';

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
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-bg flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md animate-fade-in p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="btn-icon mb-4" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white' }}>
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-2xl font-bold">Masuk ke ISTIQ-MATH</h2>
          <p className="text-muted text-sm mt-2">Lanjutkan perjalanan belajarmu!</p>
        </div>

        {error && <div className="badge badge-warning w-full justify-center mb-4 py-2">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email</label>
            <input 
              type="email" 
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input 
              type="password" 
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-sm text-primary hover:underline">Lupa password?</a>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Memuat...' : <><LogIn size={18} /> Masuk</>}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-muted">
          Belum punya akun? <Link to="/register" className="text-primary font-semibold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
