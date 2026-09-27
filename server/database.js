const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'istiqmath.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');

    // ── CORE USER TABLES ─────────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'STUDENT',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      last_active_date TEXT,
      created_at TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS istiqamah (
      user_id TEXT PRIMARY KEY,
      consistency INTEGER DEFAULT 0,
      persistence INTEGER DEFAULT 0,
      improvement INTEGER DEFAULT 0,
      reflection INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT PRIMARY KEY,
      aljabar INTEGER DEFAULT 0,
      geometri INTEGER DEFAULT 0,
      bilangan INTEGER DEFAULT 0,
      data_statistik INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // ── XP TRANSACTION LEDGER (PRD Sec.39) ───────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS xp_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      reference_id TEXT,
      amount INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, event_type, reference_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // ── LEARNING CONTENT ─────────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      topic_id TEXT,
      title TEXT NOT NULL,
      content TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic_id TEXT,
      lesson_id TEXT,
      content TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      options TEXT,
      FOREIGN KEY(topic_id) REFERENCES topics(id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS question_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      question_id TEXT,
      answer TEXT,
      is_correct INTEGER DEFAULT 0,
      attempt_number INTEGER DEFAULT 1,
      hint_used INTEGER DEFAULT 0,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )`);

    // ── PROBLEM SOLVING (PRD Sec.31) ─────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS problem_solving_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      step_diketahui TEXT,
      step_ditanya TEXT,
      step_strategi TEXT,
      step_penyelesaian TEXT,
      step_pemeriksaan TEXT,
      is_complete INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )`);

    // ── REFLECTIONS ───────────────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS reflections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      quest_id TEXT,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // ── QUESTS (PRD Sec.15-17) ────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      topic_id TEXT,
      xp_reward INTEGER DEFAULT 20,
      target_questions INTEGER DEFAULT 5,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS student_quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      quest_id TEXT NOT NULL,
      status TEXT DEFAULT 'AVAILABLE',
      lesson_completed INTEGER DEFAULT 0,
      questions_completed INTEGER DEFAULT 0,
      problem_solving_completed INTEGER DEFAULT 0,
      reflection_submitted INTEGER DEFAULT 0,
      started_at TEXT,
      completed_at TEXT,
      UNIQUE(user_id, quest_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(quest_id) REFERENCES quests(id)
    )`);

    // ── BADGES (PRD Sec.18) ───────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT '🏅',
      criteria_type TEXT,
      criteria_value INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS student_badges (
      user_id TEXT,
      badge_id TEXT,
      earned_at TEXT,
      PRIMARY KEY (user_id, badge_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(badge_id) REFERENCES badges(id)
    )`);

    // ── TKA SIMULATION (PRD Sec.33) ───────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      total_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      status TEXT DEFAULT 'IN_PROGRESS',
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS simulation_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulation_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      user_answer TEXT,
      is_correct INTEGER DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      FOREIGN KEY(simulation_id) REFERENCES simulations(id),
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )`);

    // ── EVENTS LOG ────────────────────────────────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      event_type TEXT,
      entity_type TEXT,
      entity_id TEXT,
      metadata TEXT,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Seed data after tables are created
    setTimeout(() => seedInitialData(), 500);
  });
}

function seedInitialData() {
  db.get('SELECT count(*) as count FROM topics', (err, row) => {
    if (err || !row || row.count > 0) return;

    console.log('🌱 Seeding initial learning content...');

    // Topics
    const topics = [
      ['t1', 'Aljabar', 'Persamaan, pertidaksamaan, dan fungsi', 1],
      ['t2', 'Geometri', 'Bangun datar dan bangun ruang', 2],
      ['t3', 'Bilangan', 'Operasi bilangan dan bilangan berpangkat', 3],
    ];
    topics.forEach(t => db.run('INSERT INTO topics VALUES (?,?,?,?)', t));

    // Lessons
    const lessons = [
      ['l1', 't1', 'Persamaan Linear Satu Variabel', 'Persamaan linear satu variabel (PLSV) adalah kalimat terbuka yang dihubungkan tanda sama dengan dan hanya mempunyai satu variabel berpangkat satu.\n\nContoh: 2x - 4 = 8\n\nLangkah penyelesaian:\n1. Pindahkan konstanta ke ruas kanan\n2. Bagi kedua ruas dengan koefisien variabel', 1],
      ['l2', 't1', 'Pertidaksamaan Linear', 'Pertidaksamaan linear adalah kalimat matematika yang menggunakan tanda >, <, ≥, atau ≤.\n\nContoh: 3x + 5 > 14\n\nLangkah penyelesaian serupa dengan PLSV, namun perhatikan: jika dibagi/dikali bilangan negatif, tanda berubah!', 2],
      ['l3', 't2', 'Luas dan Keliling Persegi Panjang', 'Persegi panjang memiliki dua pasang sisi yang sama panjang.\n\nRumus:\n• Luas = panjang × lebar\n• Keliling = 2 × (panjang + lebar)', 1],
    ];
    lessons.forEach(l => db.run('INSERT INTO lessons VALUES (?,?,?,?,?)', l));

    // Questions (with multiple choice stored as JSON)
    const questions = [
      ['q1', 't1', 'l1', 'Nilai x dari persamaan 2x - 4 = 8 adalah...', 'Easy', '6', 'Langkah: 2x = 8 + 4 = 12, maka x = 12/2 = 6', null],
      ['q2', 't1', 'l1', 'Jika 3x + 9 = 24, maka nilai x adalah...', 'Easy', '5', '3x = 24 - 9 = 15, maka x = 15/3 = 5', null],
      ['q3', 't1', 'l2', 'Penyelesaian dari 2x - 5 > 11 adalah...', 'Medium', 'x > 8', '2x > 11 + 5 = 16, maka x > 16/2 = 8', null],
      ['q4', 't2', 'l3', 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapa luasnya?', 'Easy', '96', 'L = 12 × 8 = 96 cm²', null],
      ['q5', 't2', 'l3', 'Keliling persegi panjang dengan panjang 15 cm dan lebar 10 cm adalah...', 'Easy', '50', 'K = 2 × (15 + 10) = 2 × 25 = 50 cm', null],
      // TKA-style questions (no lesson_id, for simulation)
      ['tka1', 't1', null, 'Diketahui p = 4 dan q = -2. Nilai dari 3p - 2q adalah...', 'Medium', '16', '3(4) - 2(-2) = 12 + 4 = 16', null],
      ['tka2', 't2', null, 'Luas lingkaran dengan jari-jari 7 cm adalah... (π = 22/7)', 'Medium', '154', 'L = π × r² = 22/7 × 49 = 154 cm²', null],
      ['tka3', 't3', null, 'Hasil dari 2³ × 2² adalah...', 'Easy', '32', '2³ × 2² = 2^(3+2) = 2⁵ = 32', null],
    ];
    questions.forEach(q => db.run('INSERT INTO questions (id, topic_id, lesson_id, content, difficulty, correct_answer, explanation, options) VALUES (?,?,?,?,?,?,?,?)', q));

    // Quests
    const quests = [
      ['quest1', 'Penakluk Aljabar: Sesi 1', 'Selesaikan materi, soal, problem solving, dan refleksi Aljabar', 't1', 25, 3, 1],
      ['quest2', 'Jelajah Geometri', 'Kuasai dasar-dasar Geometri dalam satu sesi belajar', 't2', 25, 3, 2],
    ];
    quests.forEach(q => db.run('INSERT INTO quests VALUES (?,?,?,?,?,?,?)', q));

    // Badges
    const badges = [
      ['b1', 'Jawaban Pertama', 'Berhasil menjawab soal pertama dengan benar', '✅', 'first_correct', 1],
      ['b2', 'Pantang Menyerah', 'Berhasil menjawab benar setelah mencoba 3x atau lebih', '💪', 'persistence', 3],
      ['b3', 'Penakluk Quest', 'Menyelesaikan quest pertama', '🏆', 'quest_completed', 1],
      ['b4', 'Pemikir Sejati', 'Menyelesaikan problem solving module', '🧠', 'problem_solving', 1],
      ['b5', 'Pejuang TKA', 'Menyelesaikan simulasi TKA pertama', '🎯', 'simulation', 1],
    ];
    badges.forEach(b => db.run('INSERT INTO badges VALUES (?,?,?,?,?,?)', b));

    console.log('✅ Seed data berhasil dibuat!');
  });
}

// ── Async DB helpers ──────────────────────────────────────────────
const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

module.exports = { db, dbRun, dbGet, dbAll };
