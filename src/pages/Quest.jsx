import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Target, CheckCircle, Lock, Play, BookOpen, Trophy } from 'lucide-react';

const API = 'http://localhost:3000/api';

const Quest = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const token = () => localStorage.getItem('token');

  const fetchQuests = async () => {
    try {
      const res = await fetch(`${API}/quests`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (data.success) setQuests(data.quests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuests(); }, []);

  const startQuest = async (questId) => {
    try {
      await fetch(`${API}/quests/${questId}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      });
      showNotification('Quest dimulai! Selamat berjuang 💪');
      fetchQuests();
    } catch (e) { console.error(e); }
  };

  const submitReflection = async (questId) => {
    if (!reflection.trim()) return alert('Refleksi tidak boleh kosong');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/quests/${questId}/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ content: reflection }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Refleksi tersimpan! +${data.xpEarned} XP ✨${data.completedQuests?.length > 0 ? '\n🏆 Quest Selesai!' : ''}`);
        setReflection('');
        setSelected(null);
        fetchQuests();
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content flex justify-center items-center">
        <div className="animate-pulse">Memuat Quest...</div>
      </main>
    </div>
  );

  const statusColor = { AVAILABLE: 'var(--text-muted)', IN_PROGRESS: 'var(--primary)', COMPLETED: 'var(--secondary)' };
  const statusLabel = { AVAILABLE: 'Tersedia', IN_PROGRESS: 'Sedang Berjalan', COMPLETED: 'Selesai ✓' };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '860px' }}>

          {notification && (
            <div className="card mb-4 animate-fade-in" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(99,102,241,0.15)', whiteSpace: 'pre-line' }}>
              <p className="font-semibold">{notification}</p>
            </div>
          )}

          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Quest & Misi</h1>
            <p style={{ color: 'var(--text-muted)' }}>Selesaikan misi harian untuk mendapatkan XP dan badge istimewa.</p>
          </header>

          <div className="flex flex-col gap-6">
            {quests.map((quest, i) => {
              const isActive = quest.status === 'IN_PROGRESS';
              const isDone = quest.status === 'COMPLETED';
              const questProgress = isActive || isDone ? [
                quest.lesson_completed,
                quest.questions_completed >= quest.target_questions,
                quest.problem_solving_completed,
                quest.reflection_submitted,
              ].filter(Boolean).length : 0;
              const progressPct = Math.round((questProgress / 4) * 100);

              return (
                <div key={quest.id} className={`card animate-fade-in`}
                     style={{ animationDelay: `${i * 0.1}s`, borderColor: isActive ? 'var(--primary)' : isDone ? 'var(--secondary)' : 'var(--border)', opacity: 1 }}>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div style={{ fontSize: '2rem' }}>{isDone ? '🏆' : isActive ? '⚔️' : '🔒'}</div>
                      <div>
                        <h2 className="text-xl font-bold">{quest.title}</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{quest.description}</p>
                      </div>
                    </div>
                    <div>
                      <span className="badge" style={{ color: statusColor[quest.status] || 'var(--text-muted)' }}>
                        {statusLabel[quest.status] || quest.status}
                      </span>
                      <div className="text-sm text-center mt-1" style={{ color: 'var(--primary)' }}>+{quest.xp_reward} XP</div>
                    </div>
                  </div>

                  {(isActive || isDone) && (
                    <>
                      <div className="progress-bg mb-4">
                        <div className="progress-fill" style={{ width: `${progressPct}%`, background: isDone ? 'linear-gradient(90deg, var(--secondary), #10b981)' : undefined }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          { done: quest.lesson_completed, label: '📖 Selesai Materi' },
                          { done: quest.questions_completed >= quest.target_questions, label: `✏️ Soal (${quest.questions_completed || 0}/${quest.target_questions})` },
                          { done: quest.problem_solving_completed, label: '🧠 Problem Solving' },
                          { done: quest.reflection_submitted, label: '💭 Refleksi' },
                        ].map((req, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm p-2 rounded-md" style={{ backgroundColor: req.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', color: req.done ? 'var(--secondary)' : 'var(--text-muted)' }}>
                            {req.done ? <CheckCircle size={14} /> : <div style={{ width: 14, height: 14, border: '1.5px solid var(--border)', borderRadius: '50%' }} />}
                            {req.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  {quest.status === 'AVAILABLE' && (
                    <button onClick={() => startQuest(quest.id)} className="btn btn-primary w-full flex items-center justify-center gap-2">
                      <Play size={16} /> Mulai Quest
                    </button>
                  )}

                  {isActive && (
                    <div className="flex flex-col gap-3 mt-2">
                      <Link to="/learn" className="btn btn-secondary flex items-center justify-center gap-2" style={{ textDecoration: 'none' }}>
                        <BookOpen size={16} /> Ke Ruang Belajar
                      </Link>
                      {!quest.reflection_submitted && quest.problem_solving_completed && (
                        selected === quest.id ? (
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold">Refleksi Belajar Hari Ini:</label>
                            <textarea
                              className="input"
                              rows={3}
                              placeholder="Apa yang sudah kamu pelajari? Apa yang masih sulit? Bagaimana perasaanmu setelah belajar?"
                              value={reflection}
                              onChange={e => setReflection(e.target.value)}
                              style={{ resize: 'vertical' }}
                            />
                            <div className="flex gap-2">
                              <button onClick={() => submitReflection(quest.id)} disabled={submitting} className="btn btn-primary flex-1">
                                {submitting ? 'Menyimpan...' : 'Kirim Refleksi (+10 XP)'}
                              </button>
                              <button onClick={() => setSelected(null)} className="btn btn-secondary">Batal</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setSelected(quest.id)} className="btn btn-secondary flex items-center justify-center gap-2">
                            💭 Tulis Refleksi
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {isDone && (
                    <div className="flex items-center justify-center gap-2 py-2" style={{ color: 'var(--secondary)' }}>
                      <Trophy size={20} />
                      <span className="font-semibold">Quest Selesai! Selamat! 🎉</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quest;
