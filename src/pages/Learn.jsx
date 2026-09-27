import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { BookOpen, PlayCircle, Lock } from 'lucide-react';

const Learn = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await fetch('http://localhost:3000/api/topics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setTopics(data.topics);
        }
      } catch (err) {
        console.error("Gagal mengambil materi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [navigate]);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content flex items-center justify-center">
          <div className="animate-pulse">Memuat Materi...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '900px' }}>
          <header className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Ruang Belajar</h1>
            <p className="text-muted">Pilih topik yang ingin kamu pelajari hari ini.</p>
          </header>

          <div className="flex flex-col gap-8">
            {topics.map((topic, i) => (
              <div key={topic.id} className="card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="btn-icon bg-primary" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem' }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{topic.title}</h2>
                    <p className="text-muted">{topic.description}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {topic.lessons?.map((lesson, j) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-base rounded-md border border-border hover:border-primary transition-colors cursor-pointer" 
                         style={{ backgroundColor: 'var(--bg-base)' }}
                         onClick={() => navigate(`/learn/${topic.id}/${lesson.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle size={20} className="text-primary" />
                        <span className="font-semibold">{j + 1}. {lesson.title}</span>
                      </div>
                      <div className="badge badge-success">Mulai</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
