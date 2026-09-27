import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Clock, BarChart3, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import API_URL from '../config/api';

const API = API_URL;

// ── Timer hook ─────────────────────────────────────────────────────
const useTimer = (active) => {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { seconds, fmt };
};

// ── Difficulty badge color ─────────────────────────────────────────
const diffColor = { Easy: 'var(--secondary)', Medium: 'var(--accent)', Hard: '#ef4444', Challenge: '#a855f7' };

const TKA = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const [phase, setPhase] = useState('intro');     // intro | simulation | result
  const [simId, setSimId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});       // questionId → answer string
  const [qTimes, setQTimes] = useState({});         // questionId → seconds spent
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { seconds, fmt } = useTimer(phase === 'simulation');

  const startSim = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulations/start`, { method: 'POST', headers });
      const data = await res.json();
      if (data.success) {
        setSimId(data.simulationId);
        setQuestions(data.questions);
        setQStartTime(Date.now());
        setPhase('simulation');
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(a => ({ ...a, [questionId]: answer }));
  };

  const goNext = async () => {
    // Record time spent on this question
    const spent = Math.round((Date.now() - qStartTime) / 1000);
    const qId = questions[currentQ].id;
    setQTimes(t => ({ ...t, [qId]: spent }));

    // Submit the answer to backend
    if (answers[qId] !== undefined) {
      try {
        await fetch(`${API}/simulations/${simId}/answer`, {
          method: 'POST', headers,
          body: JSON.stringify({ questionId: qId, answer: answers[qId], timeSpent: spent }),
        });
      } catch (e) { console.error(e); }
    }

    if (currentQ + 1 >= questions.length) {
      await finishSim(qId, spent);
    } else {
      setCurrentQ(q => q + 1);
      setQStartTime(Date.now());
    }
  };

  const finishSim = async (lastQId, lastSpent) => {
    // Submit last question if not yet submitted
    if (answers[lastQId] !== undefined) {
      try {
        await fetch(`${API}/simulations/${simId}/answer`, {
          method: 'POST', headers,
          body: JSON.stringify({ questionId: lastQId, answer: answers[lastQId], timeSpent: lastSpent }),
        });
      } catch (e) { console.error(e); }
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/simulations/${simId}/finish`, { method: 'POST', headers });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setPhase('result');
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Intro ────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="card animate-fade-in text-center py-10">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h1 className="text-3xl font-bold mb-3">Simulasi TKA Matematika</h1>
            <p className="mb-6" style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Latih kesiapan belajarmu dengan soal-soal acak dari berbagai topik. Hasil simulasi adalah <strong>Learning Readiness Indicator</strong>, bukan prediksi skor TKA resmi.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: '5 Soal', icon: '📝', desc: 'Dari berbagai topik' },
                { label: 'Berbatas Waktu', icon: '⏱️', desc: 'Latih manajemen waktu' },
                { label: 'Analisis Penuh', icon: '📊', desc: 'Lihat performa per topik' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-md" style={{ backgroundColor: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{item.icon}</div>
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={startSim} disabled={loading} className="btn btn-primary px-10 py-3 text-lg">
              {loading ? 'Menyiapkan Soal...' : 'Mulai Simulasi 🚀'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  // ── Simulation ───────────────────────────────────────────────────
  if (phase === 'simulation') {
    const q = questions[currentQ];
    const answered = answers[q?.id] !== undefined;

    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="container" style={{ maxWidth: '720px' }}>
            {/* Header bar */}
            <div className="flex justify-between items-center mb-6 card py-3 px-5" style={{ borderRadius: 'var(--radius-md)' }}>
              <span className="font-bold">Soal {currentQ + 1} / {questions.length}</span>
              <div className="flex items-center gap-2" style={{ color: seconds > 300 ? '#ef4444' : 'var(--text-secondary)' }}>
                <Clock size={16} /> <span className="font-mono">{fmt(seconds)}</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {Object.keys(answers).length} dijawab
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mb-6 justify-center">
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: i < currentQ ? 'var(--secondary)' : i === currentQ ? 'var(--primary)' : 'var(--border)',
                  transition: 'background-color 0.3s',
                }} />
              ))}
            </div>

            {q && (
              <div className="card animate-fade-in" key={q.id}>
                <div className="flex gap-2 mb-4">
                  <span className="badge" style={{ color: diffColor[q.difficulty] || 'var(--text-muted)' }}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-xl font-medium mb-8 leading-relaxed">{q.content}</p>

                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Jawaban kamu..."
                    value={answers[q.id] || ''}
                    onChange={e => handleAnswer(q.id, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goNext()}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleAnswer(q.id, '')}
                    className="btn btn-secondary text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Lewati soal ini
                  </button>
                  <button onClick={goNext} className="btn btn-primary flex gap-2">
                    {currentQ + 1 >= questions.length ? 'Selesai & Lihat Hasil' : 'Berikutnya'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const grade = result.accuracy >= 80 ? { label: 'Sangat Baik!', color: 'var(--secondary)', emoji: '🏆' }
      : result.accuracy >= 60 ? { label: 'Cukup Baik', color: 'var(--accent)', emoji: '👍' }
      : { label: 'Perlu Latihan Lagi', color: '#ef4444', emoji: '💪' };

    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="container" style={{ maxWidth: '800px' }}>

            {/* Score card */}
            <div className="card text-center mb-6 animate-fade-in py-8">
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{grade.emoji}</div>
              <h1 className="text-4xl font-bold mb-1" style={{ color: grade.color }}>{result.accuracy}%</h1>
              <p className="text-xl font-semibold mb-2">{grade.label}</p>
              <p style={{ color: 'var(--text-muted)' }}>
                {result.correctAnswers} dari {result.totalQuestions} soal benar • +{result.xpEarned} XP
              </p>
              {result.newBadges?.includes('b5') && (
                <div className="badge mt-3">🎯 Badge "Pejuang TKA" diraih!</div>
              )}
            </div>

            {/* Topic breakdown */}
            <div className="card mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} style={{ color: 'var(--primary)' }} /> Performa per Topik
              </h2>
              {result.topicPerformance.map((tp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold">{tp.topicName}</span>
                    <span style={{ color: tp.accuracy >= 60 ? 'var(--secondary)' : '#ef4444' }}>
                      {tp.correct}/{tp.total} ({tp.accuracy}%)
                    </span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{
                      width: `${tp.accuracy}%`,
                      background: tp.accuracy >= 60 ? 'linear-gradient(90deg, var(--secondary), #10b981)' : 'linear-gradient(90deg, #ef4444, #f97316)'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Review answers */}
            <div className="card mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-bold mb-4">📋 Review Jawaban</h2>
              {result.answers.map((a, i) => (
                <div key={i} className="mb-4 pb-4" style={{ borderBottom: i < result.answers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{a.is_correct ? <CheckCircle size={18} style={{ color: 'var(--secondary)' }} /> : <XCircle size={18} style={{ color: '#ef4444' }} />}</div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{a.content}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Jawabanmu: <strong>{a.user_answer || '(kosong)'}</strong> •
                        Jawaban benar: <strong style={{ color: 'var(--secondary)' }}>{a.correct_answer}</strong>
                      </p>
                      {!a.is_correct && a.explanation && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          💡 {a.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => { setPhase('intro'); setCurrentQ(0); setAnswers({}); setResult(null); }} className="btn btn-secondary">
                Coba Lagi
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                Ke Dashboard
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default TKA;
