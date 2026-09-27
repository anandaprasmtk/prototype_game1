import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Target, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="hero-bg flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center text-center animate-fade-in" style={{ padding: '6rem 1.5rem' }}>
        
        <div className="badge mb-8 animate-pulse">
          <Sparkles size={14} />
          <span>Platform Pembelajaran AI & Gamifikasi</span>
        </div>

        <h1 className="text-5xl font-bold mb-6" style={{ maxWidth: '800px' }}>
          Belajar Matematika. <span className="text-gradient">Tantang Dirimu.</span> Tumbuh Setiap Hari.
        </h1>
        
        <p className="text-xl text-muted mb-8" style={{ maxWidth: '600px' }}>
          Platform pembelajaran matematika berbasis AI dan gamification untuk membantu siswa SMP belajar secara konsisten dan mempersiapkan diri menghadapi TKA.
        </p>

        <div className="flex gap-4">
          <Link to="/dashboard" className="btn btn-primary text-lg">
            Mulai Belajar <ArrowRight size={20} />
          </Link>
          <button className="btn btn-secondary text-lg">
            Lihat Cara Kerja
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16" style={{ maxWidth: '900px', width: '100%' }}>
          <div className="card flex flex-col items-center text-center gap-4">
            <div className="btn-icon" style={{ padding: '1rem', color: 'var(--primary)' }}>
              <Brain size={32} />
            </div>
            <h3 className="text-xl">AI Tutor</h3>
            <p className="text-muted text-sm">Diagnosis kesalahan dan dapatkan hint adaptif saat menemui kesulitan.</p>
          </div>
          <div className="card flex flex-col items-center text-center gap-4">
            <div className="btn-icon" style={{ padding: '1rem', color: 'var(--accent)' }}>
              <Target size={32} />
            </div>
            <h3 className="text-xl">Sistem Quest</h3>
            <p className="text-muted text-sm">Selesaikan misi harian dan tantangan topik untuk mendapatkan XP.</p>
          </div>
          <div className="card flex flex-col items-center text-center gap-4">
            <div className="btn-icon" style={{ padding: '1rem', color: 'var(--secondary)' }}>
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl">Nilai Istiqamah</h3>
            <p className="text-muted text-sm">Bangun konsistensi dan pantang menyerah melalui sistem gamifikasi yang seru.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
