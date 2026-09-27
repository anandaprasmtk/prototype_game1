import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, BrainCircuit } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess("Registrasi berhasil! Silakan masuk.");
        setTimeout(() => navigate('/login'), 2000);
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
    <div className="hero-bg flex items-center justify-center min-h-screen py-16">
      <div className="card w-full max-w-md animate-fade-in p-8" style={{ marginTop: '2rem' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="btn-icon mb-4" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white' }}>
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-2xl font-bold">Daftar Akun Baru</h2>
          <p className="text-muted text-sm mt-2">Mulai tantangan matematika mu!</p>
        </div>

        {error && <div className="badge badge-warning w-full justify-center mb-4 py-2">{error}</div>}
        {success && <div className="badge badge-success w-full justify-center mb-4 py-2">{success}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Nama Lengkap</label>
            <input 
              type="text" name="name"
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={formData.name} onChange={handleChange} required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Username</label>
            <input 
              type="text" name="username"
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={formData.username} onChange={handleChange} required
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email</label>
            <input 
              type="email" name="email"
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={formData.email} onChange={handleChange} required
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input 
              type="password" name="password"
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={formData.password} onChange={handleChange} required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Konfirmasi Password</label>
            <input 
              type="password" name="confirmPassword"
              className="bg-base border border-border rounded-md p-2 text-main focus:border-primary outline-none"
              style={{ backgroundColor: 'var(--bg-base)' }}
              value={formData.confirmPassword} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Memproses...' : <><UserPlus size={18} /> Daftar</>}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-muted">
          Sudah punya akun? <Link to="/login" className="text-primary font-semibold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
