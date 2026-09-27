import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Target, ArrowRight, CheckCircle, BrainCircuit } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="hero-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between container" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="flex items-center gap-2">
          <div className="btn-icon" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem' }}>
            <BrainCircuit size={20} />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>ISTIQ-MATH</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-secondary text-sm">Masuk</Link>
          <Link to="/register" className="btn btn-primary text-sm">Daftar Gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="container flex flex-col items-center text-center animate-fade-in" style={{ padding: '5rem 1.5rem 3rem' }}>
        <div className="badge mb-6" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
          <Sparkles size={14} />
          Platform Pembelajaran AI & Gamifikasi
        </div>

        <h1 className="text-5xl font-bold mb-4" style={{ maxWidth: '700px', lineHeight: 1.15 }}>
          Belajar Matematika.{' '}
          <span className="text-gradient">Tantang Dirimu.</span>{' '}
          Tumbuh Setiap Hari.
        </h1>

        <p className="text-lg mb-8" style={{ maxWidth: '540px', color: 'var(--text-muted)' }}>
          Platform pembelajaran matematika berbasis AI dan gamification untuk membantu siswa SMP belajar secara konsisten dan mempersiapkan diri menghadapi TKA.
        </p>

        <div className="flex gap-4">
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Mulai Belajar <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Lihat Fitur
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div className="grid grid-cols-3 gap-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: <Brain size={28} />, title: 'AI Tutor', desc: 'Diagnosis kesalahan dan dapatkan petunjuk adaptif saat menemui kesulitan.', color: '#059669' },
            { icon: <Target size={28} />, title: 'Sistem Quest', desc: 'Selesaikan misi harian dan tantangan topik untuk mendapatkan XP.', color: '#0d9488' },
            { icon: <Sparkles size={28} />, title: 'Nilai Istiqamah', desc: 'Bangun konsistensi dan pantang menyerah melalui sistem gamifikasi.', color: '#f59e0b' },
          ].map((f, i) => (
            <div key={i} className="card flex flex-col items-center text-center gap-3 py-8">
              <div className="btn-icon" style={{ padding: '0.875rem', backgroundColor: `${f.color}15`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-8" style={{ color: 'var(--text-muted)' }}>
          {['Gamifikasi Teruji', 'AI-Powered', 'Berbasis Riset'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} style={{ color: 'var(--primary)' }} /> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
