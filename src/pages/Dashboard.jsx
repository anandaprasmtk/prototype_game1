import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Target, Flame, Star, Sparkles, BookOpen, BarChart3, Award, Zap } from 'lucide-react';

const API = 'http://localhost:3000/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const res = await fetch(`${API}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); return navigate('/login'); }
      const result = await res.json();
      if (!result.error) setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Sparkles size={32} style={{ color: 'var(--primary)' }} />
          <p>Memuat dashboard...</p>
        </div>
      </main>
    </div>
  );

  if (!data) return null;
  const { student, activeQuest, badges, istiqamah, stats } = data;

  let questProgress = 0;
  if (activeQuest) {
    const done = [
      activeQuest.lesson_completed,
      activeQuest.questions_completed >= activeQuest.target_questions,
      activeQuest.problem_solving_completed,
      activeQuest.reflection_submitted,
    ].filter(Boolean).length;
    questProgress = Math.round((done / 4) * 100);
  }

  const xpThresholds = [100, 250, 500, 800, 1200];
  const currentThreshold = xpThresholds[student.level - 1] || 9999;
  const prevThreshold = xpThresholds[student.level - 2] || 0;
  const xpInLevel = student.xp - prevThreshold;
  const xpNeeded = currentThreshold - prevThreshold;
  const levelProgress = Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '920px' }}>

          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-3">Halo, {student.name} 👋</h1>
            <div className="flex gap-3 flex-wrap">
              <span className="badge"><Star size={14} fill="currentColor" /> Level {student.level}</span>
              <span className="badge badge-success"><Zap size={14} /> {student.xp} XP</span>
              <span className="badge badge-warning"><Flame size={14} fill="currentColor" /> {student.streak} Hari Streak</span>
              <span className="badge">🎯 Akurasi {stats.accuracy}%</span>
            </div>
          </header>

          {/* XP Progress */}
          <div className="card mb-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-semibold">Progress Level {student.level} → {student.level + 1}</span>
              <span style={{ color: 'var(--primary)' }}>{student.xp} / {currentThreshold} XP</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Active Quest */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Target size={20} style={{ color: 'var(--primary)' }} />
                Quest Aktif
              </h2>
              {activeQuest ? (
                <>
                  <p className="font-semibold mb-1">{activeQuest.title}</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{activeQuest.description}</p>
                  <div className="progress-bg mb-3">
                    <div className="progress-fill" style={{ width: `${questProgress}%` }} />
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs">
                    {[
                      { done: activeQuest.lesson_completed, label: 'Materi' },
                      { done: activeQuest.questions_completed >= activeQuest.target_questions, label: `Soal (${activeQuest.questions_completed}/${activeQuest.target_questions})` },
                      { done: activeQuest.problem_solving_completed, label: 'Problem Solving' },
                      { done: activeQuest.reflection_submitted, label: 'Refleksi' },
                    ].map((item, i) => (
                      <span key={i} className={`badge ${item.done ? 'badge-success' : ''}`}>
                        {item.done ? '✓' : '○'} {item.label}
                      </span>
                    ))}
                  </div>
                  <Link to="/quest" className="btn btn-primary w-full mt-4" style={{ display: 'block', textAlign: 'center' }}>
                    Lanjutkan Quest
                  </Link>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Belum ada quest aktif.</p>
                  <Link to="/quest" className="btn btn-primary">Pilih Quest</Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <BarChart3 size={20} style={{ color: 'var(--primary)' }} /> Statistik
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Soal Dijawab', value: stats.totalAttempts },
                  { label: 'Jawaban Benar', value: stats.totalCorrect },
                  { label: 'Akurasi', value: `${stats.accuracy}%` },
                  { label: 'Simulasi TKA', value: stats.simulationsCompleted },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Istiqamah */}
          <div className="card mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Nilai Istiqamah
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Konsistensi', value: istiqamah.consistency, desc: 'Hari belajar aktif' },
                { label: 'Persistensi', value: istiqamah.persistence, desc: 'Semangat mencoba ulang' },
                { label: 'Peningkatan', value: istiqamah.improvement, desc: 'Perbaikan jawaban' },
                { label: 'Refleksi', value: istiqamah.reflection, desc: 'Sesi perenungan' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-md" style={{ backgroundColor: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{item.value}</div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          {badges?.length > 0 && (
            <div className="card animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={20} style={{ color: 'var(--primary)' }} /> Pencapaian ({badges.length})
              </h2>
              <div className="flex gap-3 flex-wrap">
                {badges.map(b => (
                  <div key={b.badge_id} className="flex flex-col items-center gap-1 p-3 rounded-md text-center" style={{ backgroundColor: 'rgba(99,102,241,0.08)', minWidth: '80px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
                    <span className="text-xs font-semibold">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Nav */}
          <div className="grid grid-cols-3 gap-4 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { label: 'Ruang Belajar', icon: <BookOpen size={24} />, path: '/learn' },
              { label: 'Quest & Misi', icon: <Target size={24} />, path: '/quest' },
              { label: 'Simulasi TKA', icon: <BarChart3 size={24} />, path: '/tka' },
            ].map((item, i) => (
              <Link key={i} to={item.path} className="card text-center py-6 hover:border-primary transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', textDecoration: 'none' }}>
                <div className="flex justify-center mb-2" style={{ color: 'var(--primary)' }}>{item.icon}</div>
                <div className="font-semibold text-sm">{item.label}</div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
