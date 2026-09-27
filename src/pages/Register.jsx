import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, BrainCircuit } from 'lucide-react';
import API_URL from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: ''
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
    setError(''); setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak cocok.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, username: formData.username,
          email: formData.email, password: formData.password
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend sedang berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama kamu' },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'username_kamu' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="auth-bg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="auth-card animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="btn-icon mb-3" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white' }}>
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-2xl font-bold">Daftar Akun Baru</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Mulai tantangan matematikamu!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm font-medium" style={{ backgroundColor: 'var(--danger-light)', color: '#b91c1c', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm font-medium" style={{ backgroundColor: '#d1fae5', color: '#047857', borderRadius: 'var(--radius-md)' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
              <input
                type={f.type} name={f.name}
                className="input"
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Memproses...' : <><UserPlus size={16} /> Daftar</>}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
