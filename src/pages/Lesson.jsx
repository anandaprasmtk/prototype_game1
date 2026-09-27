import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, CheckCircle, Lightbulb, Sparkles, ChevronRight } from 'lucide-react';

const API = 'http://localhost:3000/api';

// ── Lesson Reading View ────────────────────────────────────────────
const LessonContent = ({ lesson, onDone }) => (
  <div className="card animate-fade-in">
    <div className="flex items-center gap-2 mb-2">
      <span className="badge">📖 Materi</span>
    </div>
    <h2 className="text-2xl font-bold mb-6">{lesson.title}</h2>
    <div className="mb-8" style={{ lineHeight: '1.9', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
      {lesson.content}
    </div>
    <button onClick={onDone} className="btn btn-primary w-full flex items-center justify-center gap-2">
      Lanjut ke Latihan Soal <ChevronRight size={18} />
    </button>
  </div>
);

// ── Problem Solving View (PRD Sec.31) ─────────────────────────────
const ProblemSolving = ({ question, onSubmit }) => {
  const [steps, setSteps] = useState({ step_diketahui: '', step_ditanya: '', step_strategi: '', step_penyelesaian: '', step_pemeriksaan: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, val) => setSteps(s => ({ ...s, [field]: val }));

  const handleSubmit = async () => {
    const allFilled = Object.values(steps).every(v => v.trim());
    if (!allFilled) return alert('Semua langkah wajib diisi!');
    setSubmitting(true);
    await onSubmit(steps);
    setSubmitting(false);
  };

  const stepFields = [
    { key: 'step_diketahui', label: '📋 Apa yang Diketahui?', placeholder: 'Tuliskan semua informasi yang diberikan soal...' },
    { key: 'step_ditanya', label: '❓ Apa yang Ditanyakan?', placeholder: 'Apa yang harus dicari atau dibuktikan?' },
    { key: 'step_strategi', label: '🗺️ Strategi Apa yang Digunakan?', placeholder: 'Rumus, metode, atau cara apa yang akan dipakai?' },
    { key: 'step_penyelesaian', label: '✏️ Tuliskan Penyelesaian', placeholder: 'Kerjakan soal langkah demi langkah di sini...' },
    { key: 'step_pemeriksaan', label: '✅ Apakah Jawaban Masuk Akal?', placeholder: 'Periksa kembali jawaban: apakah sudah benar dan masuk akal?' },
  ];

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-2 mb-2"><span className="badge">🧠 Problem Solving</span></div>
      <h2 className="text-xl font-bold mb-2">Soal Problem Solving</h2>
      <div className="p-4 mb-6 rounded-md text-base font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)' }}>
        {question.content}
      </div>
      <div className="flex flex-col gap-5">
        {stepFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-sm font-bold mb-2 block">{label}</label>
            <textarea
              className="input"
              rows={3}
              placeholder={placeholder}
              value={steps[key]}
              onChange={e => handleChange(key, e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary w-full mt-6">
        {submitting ? 'Menyimpan...' : 'Submit Problem Solving (+15 XP) 🧠'}
      </button>
    </div>
  );
};

// ── Main Lesson Page ───────────────────────────────────────────────
const Lesson = () => {
  const { topicId, lessonId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('reading'); // reading | practice | problem-solving | done
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attemptNum, setAttemptNum] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lRes, qRes] = await Promise.all([
          fetch(`${API}/lessons/${lessonId}`, { headers }),
          fetch(`${API}/questions/lesson/${lessonId}`, { headers }),
        ]);
        const lData = await lRes.json();
        const qData = await qRes.json();
        if (lData.success) setLesson(lData.lesson);
        if (qData.success) setQuestions(qData.questions);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [lessonId]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      const res = await fetch(`${API}/questions/${questions[currentQ].id}/attempt`, {
        method: 'POST', headers,
        body: JSON.stringify({ answer, attemptNumber: attemptNum }),
      });
      const data = await res.json();
      setFeedback(data);
      if (!data.isCorrect) setAttemptNum(n => n + 1);
      if (data.newBadges?.length > 0) {
        setNotification({ type: 'badge', message: `🏅 Badge baru diraih!` });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (e) { console.error(e); }
  };

  const getHint = async () => {
    if (!answer.trim()) { alert('Isi jawabanmu dulu sebelum minta petunjuk!'); return; }
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai/hint`, {
        method: 'POST', headers,
        body: JSON.stringify({ questionContent: questions[currentQ].content, studentAnswer: answer, attemptNumber: attemptNum }),
      });
      const data = await res.json();
      setAiHint(data.hint || data.error);
    } catch (e) { setAiHint('AI Tutor tidak tersedia saat ini.'); }
    finally { setAiLoading(false); }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setPhase('problem-solving');
    } else {
      setCurrentQ(q => q + 1);
      setFeedback(null); setAnswer(''); setAiHint(''); setAttemptNum(1);
    }
  };

  const submitProblemSolving = async (steps) => {
    try {
      const res = await fetch(`${API}/problem-solving/${questions[0].id}/submit`, {
        method: 'POST', headers,
        body: JSON.stringify(steps),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => { setNotification(null); setPhase('done'); }, 2000);
      }
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <main className="main-content flex justify-center items-center"><div className="animate-pulse">Memuat...</div></main>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '800px' }}>
          <button onClick={() => navigate('/learn')} className="btn btn-secondary mb-6 flex gap-2 text-sm">
            <ArrowLeft size={16} /> Kembali
          </button>

          {notification && (
            <div className="card mb-4 animate-fade-in" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(99,102,241,0.15)' }}>
              <p className="font-semibold">{notification.message}</p>
            </div>
          )}

          {/* Phase: Reading */}
          {phase === 'reading' && lesson && (
            <LessonContent lesson={lesson} onDone={() => setPhase(questions.length > 0 ? 'practice' : 'problem-solving')} />
          )}

          {/* Phase: Practice Questions */}
          {phase === 'practice' && questions.length > 0 && (
            <div className="card animate-fade-in">
              <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="badge">Soal {currentQ + 1} dari {questions.length}</span>
                <span className="badge badge-warning">🎯 {questions[currentQ].difficulty}</span>
              </div>

              <p className="text-xl mb-8 font-medium leading-relaxed">{questions[currentQ].content}</p>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Ketik jawabanmu..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={feedback?.isCorrect}
                  onKeyDown={e => e.key === 'Enter' && !feedback?.isCorrect && submitAnswer()}
                />
                {!feedback?.isCorrect && (
                  <button onClick={submitAnswer} className="btn btn-primary">Cek</button>
                )}
              </div>

              {feedback && (
                <div className={`p-4 rounded-md mb-4`} style={{
                  backgroundColor: feedback.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${feedback.isCorrect ? 'var(--secondary)' : '#ef4444'}`,
                  borderRadius: 'var(--radius-md)'
                }}>
                  <p className="font-bold" style={{ color: feedback.isCorrect ? 'var(--secondary)' : '#ef4444' }}>
                    {feedback.isCorrect ? <CheckCircle size={16} style={{ display: 'inline', marginRight: 6 }} /> : null}
                    {feedback.message}
                  </p>
                  {feedback.isCorrect && feedback.explanation && (
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>💡 {feedback.explanation}</p>
                  )}
                </div>
              )}

              {/* AI Hint section (only on incorrect) */}
              {feedback && !feedback.isCorrect && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles size={16} style={{ color: 'var(--primary)' }} /> Tanya AI Tutor
                    </span>
                    <button onClick={getHint} disabled={aiLoading} className="btn btn-secondary text-sm flex gap-2">
                      <Lightbulb size={14} /> {aiLoading ? 'Berpikir...' : 'Minta Petunjuk'}
                    </button>
                  </div>
                  {aiHint && (
                    <div className="p-4 rounded-md text-sm leading-relaxed" style={{ backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ color: 'var(--primary)' }}>AI Tutor: </strong>{aiHint}
                    </div>
                  )}
                </div>
              )}

              {feedback?.isCorrect && (
                <div className="flex justify-end mt-6">
                  <button onClick={nextQuestion} className="btn btn-primary flex gap-2">
                    {currentQ + 1 >= questions.length ? 'Lanjut ke Problem Solving 🧠' : 'Soal Berikutnya'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase: Problem Solving */}
          {phase === 'problem-solving' && questions.length > 0 && (
            <ProblemSolving question={questions[0]} onSubmit={submitProblemSolving} />
          )}

          {/* Phase: Done */}
          {phase === 'done' && (
            <div className="card text-center py-12 animate-fade-in">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 className="text-3xl font-bold mb-3">Pelajaran Selesai!</h2>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                Kamu telah menyelesaikan materi, latihan soal, dan problem solving. <br />
                Jangan lupa tulis refleksi di halaman Quest!
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/quest')} className="btn btn-primary">Ke Quest & Refleksi</button>
                <button onClick={() => navigate('/learn')} className="btn btn-secondary">Materi Lain</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lesson;
