/**
 * Learning Routes: Content, Questions, Problem Solving, AI Tutor, Quest, TKA Simulation
 * PRD Sec. 30-33, 44, 59-61
 */

const express = require('express');
const { dbAll, dbGet, dbRun } = require('./database');
const { awardXP, updateStreak, checkBadges, checkAndCompleteQuests, logEvent, XP_RULES, xpForNextLevel } = require('./gamification');

let genAI = null;
try {
  const { GoogleGenAI } = require('@google/genai');
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.warn('⚠️  @google/genai not available, AI responses will be mocked.');
}

const router = express.Router();

// ════════════════════════════════════════════════════════════
// LEARNING CONTENT
// ════════════════════════════════════════════════════════════

// GET all topics with their lessons
router.get('/topics', async (req, res) => {
  try {
    const topics = await dbAll('SELECT * FROM topics ORDER BY order_index');
    for (const topic of topics) {
      topic.lessons = await dbAll('SELECT id, title, order_index FROM lessons WHERE topic_id=? ORDER BY order_index', [topic.id]);
    }
    res.json({ success: true, topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data materi' });
  }
});

// GET single lesson with full content
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await dbGet('SELECT * FROM lessons WHERE id=?', [req.params.id]);
    if (!lesson) return res.status(404).json({ error: 'Materi tidak ditemukan' });
    res.json({ success: true, lesson });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET questions for a lesson (without correct_answer!)
router.get('/questions/lesson/:lessonId', async (req, res) => {
  try {
    const questions = await dbAll(
      'SELECT id, topic_id, lesson_id, content, difficulty FROM questions WHERE lesson_id=?',
      [req.params.lessonId]
    );
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil soal' });
  }
});

// ════════════════════════════════════════════════════════════
// ATTEMPT ENGINE (PRD Sec. 35, 59, 91)
// ════════════════════════════════════════════════════════════

router.post('/questions/:id/attempt', async (req, res) => {
  const userId = req.user.id;
  const questionId = req.params.id;
  const { answer, attemptNumber = 1 } = req.body;

  if (!answer?.trim()) return res.status(400).json({ error: 'Jawaban tidak boleh kosong' });

  try {
    // Step 1: Validate question exists
    const question = await dbGet('SELECT * FROM questions WHERE id=?', [questionId]);
    if (!question) return res.status(404).json({ error: 'Soal tidak ditemukan' });

    // Step 2: Evaluate answer (server-side only)
    const isCorrect = answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
    const now = new Date().toISOString();

    // Step 3: Save attempt
    await dbRun(
      `INSERT INTO question_attempts (user_id, question_id, answer, is_correct, attempt_number, created_at) VALUES (?,?,?,?,?,?)`,
      [userId, questionId, answer.trim(), isCorrect ? 1 : 0, attemptNumber, now]
    );

    // Step 4: Award XP + Update streak (idempotent, only on correct)
    let xpEarned = 0;
    let newBadges = [];
    if (isCorrect) {
      const xpType = attemptNumber === 1 ? 'question_correct_first_try' : 'question_correct';
      const xpAmount = attemptNumber === 1 ? XP_RULES.question_correct_first_try : XP_RULES.question_correct;
      // reference_id = userId+questionId ensures one reward per question per student
      xpEarned = await awardXP(userId, xpType, `${userId}_${questionId}`, xpAmount);
      await updateStreak(userId);

      // Step 5: Update quest progress (question_completed)
      await updateQuestProgress(userId, 'question_completed', question.topic_id);

      // Step 6: Check badges
      newBadges = await checkBadges(userId);

      // Step 7: Log event
      await logEvent(userId, 'question_completed', 'question', questionId, { isCorrect, attemptNumber });
    }

    // Step 8: Return updated state
    const updatedUser = await dbGet('SELECT xp, level, streak FROM users WHERE id=?', [userId]);
    const completedQuests = await checkAndCompleteQuests(userId);

    res.json({
      success: true,
      isCorrect,
      explanation: isCorrect ? question.explanation : null,
      message: isCorrect ? `Jawaban Benar! +${xpEarned} XP 🎉` : `Kurang tepat, coba lagi! (Percobaan ke-${attemptNumber})`,
      xpEarned,
      newBadges,
      questsCompleted: completedQuests,
      student: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memproses jawaban' });
  }
});

// Helper: update lesson/question counts on active quest
async function updateQuestProgress(userId, eventType, topicId) {
  const sq = await dbGet(
    `SELECT sq.id FROM student_quests sq
     JOIN quests q ON sq.quest_id = q.id
     WHERE sq.user_id=? AND sq.status='IN_PROGRESS' AND q.topic_id=?`,
    [userId, topicId]
  );
  if (!sq) return;

  if (eventType === 'lesson_completed') {
    await dbRun(`UPDATE student_quests SET lesson_completed=1 WHERE id=?`, [sq.id]);
  } else if (eventType === 'question_completed') {
    await dbRun(`UPDATE student_quests SET questions_completed = MIN(questions_completed + 1, (SELECT target_questions FROM quests WHERE id=(SELECT quest_id FROM student_quests WHERE id=?))) WHERE id=?`, [sq.id, sq.id]);
  } else if (eventType === 'problem_solving_completed') {
    await dbRun(`UPDATE student_quests SET problem_solving_completed=1 WHERE id=?`, [sq.id]);
  } else if (eventType === 'reflection_submitted') {
    await dbRun(`UPDATE student_quests SET reflection_submitted=1 WHERE id=?`, [sq.id]);
  }
}

// ════════════════════════════════════════════════════════════
// QUEST ENGINE (PRD Sec. 15-17, 90)
// ════════════════════════════════════════════════════════════

// GET all quests for student with their progress
router.get('/quests', async (req, res) => {
  const userId = req.user.id;
  try {
    // Ensure student has quest rows
    const allQuests = await dbAll('SELECT * FROM quests ORDER BY order_index');
    for (const q of allQuests) {
      await dbRun(`INSERT OR IGNORE INTO student_quests (user_id, quest_id, status) VALUES (?,?,?)`, [userId, q.id, 'AVAILABLE']);
    }

    const quests = await dbAll(
      `SELECT q.*, sq.status, sq.lesson_completed, sq.questions_completed,
              sq.problem_solving_completed, sq.reflection_submitted, sq.completed_at
       FROM quests q
       LEFT JOIN student_quests sq ON sq.quest_id=q.id AND sq.user_id=?
       ORDER BY q.order_index`,
      [userId]
    );
    res.json({ success: true, quests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil quest' });
  }
});

// POST: Start a quest
router.post('/quests/:id/start', async (req, res) => {
  const userId = req.user.id;
  const questId = req.params.id;
  try {
    const quest = await dbGet('SELECT * FROM quests WHERE id=?', [questId]);
    if (!quest) return res.status(404).json({ error: 'Quest tidak ditemukan' });

    await dbRun(
      `INSERT OR IGNORE INTO student_quests (user_id, quest_id, status, started_at) VALUES (?,?,'IN_PROGRESS',?)`,
      [userId, questId, new Date().toISOString()]
    );
    await dbRun(
      `UPDATE student_quests SET status='IN_PROGRESS', started_at=? WHERE user_id=? AND quest_id=? AND status='AVAILABLE'`,
      [new Date().toISOString(), userId, questId]
    );

    res.json({ success: true, message: 'Quest dimulai!' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memulai quest' });
  }
});

// POST: Submit reflection for a quest (PRD Sec. 86 - reflection loop)
router.post('/quests/:id/reflect', async (req, res) => {
  const userId = req.user.id;
  const questId = req.params.id;
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Refleksi tidak boleh kosong' });

  try {
    await dbRun(
      `INSERT INTO reflections (user_id, quest_id, content, created_at) VALUES (?,?,?,?)`,
      [userId, questId, content.trim(), new Date().toISOString()]
    );
    await updateQuestProgress(userId, 'reflection_submitted', null);
    // Also handle when quest_id is directly given
    await dbRun(
      `UPDATE student_quests SET reflection_submitted=1 WHERE user_id=? AND quest_id=?`,
      [userId, questId]
    );

    const xpEarned = await awardXP(userId, 'reflection_submitted', `${userId}_${questId}_reflect`, XP_RULES.reflection_submitted);
    await dbRun('INSERT OR IGNORE INTO istiqamah (user_id) VALUES (?)', [userId]);
    await dbRun('UPDATE istiqamah SET reflection = reflection + 1 WHERE user_id=?', [userId]);
    await logEvent(userId, 'reflection_submitted', 'quest', questId, { content: content.substring(0, 100) });

    const completedQuests = await checkAndCompleteQuests(userId);
    const newBadges = await checkBadges(userId);
    const updatedUser = await dbGet('SELECT xp, level, streak FROM users WHERE id=?', [userId]);

    res.json({ success: true, xpEarned, completedQuests, newBadges, student: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan refleksi' });
  }
});

// ════════════════════════════════════════════════════════════
// PROBLEM SOLVING MODULE (PRD Sec. 31)
// ════════════════════════════════════════════════════════════

router.post('/problem-solving/:questionId/submit', async (req, res) => {
  const userId = req.user.id;
  const questionId = req.params.questionId;
  const { step_diketahui, step_ditanya, step_strategi, step_penyelesaian, step_pemeriksaan } = req.body;

  if (!step_diketahui || !step_ditanya || !step_strategi || !step_penyelesaian || !step_pemeriksaan) {
    return res.status(400).json({ error: 'Semua langkah problem solving wajib diisi' });
  }

  try {
    const question = await dbGet('SELECT * FROM questions WHERE id=?', [questionId]);
    if (!question) return res.status(404).json({ error: 'Soal tidak ditemukan' });

    const now = new Date().toISOString();
    await dbRun(
      `INSERT INTO problem_solving_attempts 
       (user_id, question_id, step_diketahui, step_ditanya, step_strategi, step_penyelesaian, step_pemeriksaan, is_complete, created_at)
       VALUES (?,?,?,?,?,?,?,1,?)`,
      [userId, questionId, step_diketahui, step_ditanya, step_strategi, step_penyelesaian, step_pemeriksaan, now]
    );

    // Award XP (idempotent: one reward per question per student)
    const xpEarned = await awardXP(userId, 'problem_solving_completed', `${userId}_ps_${questionId}`, XP_RULES.problem_solving_completed);
    await updateStreak(userId);
    await dbRun('INSERT OR IGNORE INTO istiqamah (user_id) VALUES (?)', [userId]);
    await dbRun('UPDATE istiqamah SET persistence = persistence + 1 WHERE user_id=?', [userId]);

    // Update quest progress
    await updateQuestProgress(userId, 'problem_solving_completed', question.topic_id);
    const completedQuests = await checkAndCompleteQuests(userId);
    const newBadges = await checkBadges(userId);

    await logEvent(userId, 'problem_solving_completed', 'question', questionId);
    const updatedUser = await dbGet('SELECT xp, level, streak FROM users WHERE id=?', [userId]);

    res.json({
      success: true,
      message: `Problem Solving selesai! +${xpEarned} XP 🧠`,
      xpEarned,
      explanation: question.explanation,
      completedQuests,
      newBadges,
      student: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan problem solving' });
  }
});

// ════════════════════════════════════════════════════════════
// TKA SIMULATION (PRD Sec. 33)
// ════════════════════════════════════════════════════════════

// GET: Start a new simulation (returns questions WITHOUT answers)
router.post('/simulations/start', async (req, res) => {
  const userId = req.user.id;
  try {
    // Pick 5 random TKA questions (no lesson_id = TKA questions)
    const questions = await dbAll(
      `SELECT id, content, difficulty, topic_id FROM questions ORDER BY RANDOM() LIMIT 5`
    );
    if (questions.length === 0) return res.status(404).json({ error: 'Soal simulasi tidak tersedia' });

    const now = new Date().toISOString();
    const result = await dbRun(
      `INSERT INTO simulations (user_id, started_at, total_questions, status) VALUES (?,?,?,'IN_PROGRESS')`,
      [userId, now, questions.length]
    );

    await logEvent(userId, 'simulation_started', 'simulation', String(result.lastID));

    res.json({ success: true, simulationId: result.lastID, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memulai simulasi' });
  }
});

// POST: Submit one answer during simulation
router.post('/simulations/:simId/answer', async (req, res) => {
  const userId = req.user.id;
  const simId = req.params.simId;
  const { questionId, answer, timeSpent = 0 } = req.body;

  try {
    const sim = await dbGet('SELECT * FROM simulations WHERE id=? AND user_id=?', [simId, userId]);
    if (!sim || sim.status !== 'IN_PROGRESS') return res.status(400).json({ error: 'Simulasi tidak valid atau sudah selesai' });

    const question = await dbGet('SELECT * FROM questions WHERE id=?', [questionId]);
    if (!question) return res.status(404).json({ error: 'Soal tidak ditemukan' });

    const isCorrect = answer?.trim().toLowerCase() === question.correct_answer.toLowerCase() ? 1 : 0;

    await dbRun(
      `INSERT OR IGNORE INTO simulation_attempts (simulation_id, question_id, user_answer, is_correct, time_spent) VALUES (?,?,?,?,?)`,
      [simId, questionId, answer, isCorrect, timeSpent]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan jawaban' });
  }
});

// POST: Finish simulation & get result (PRD Sec. 33)
router.post('/simulations/:simId/finish', async (req, res) => {
  const userId = req.user.id;
  const simId = req.params.simId;

  try {
    const sim = await dbGet('SELECT * FROM simulations WHERE id=? AND user_id=?', [simId, userId]);
    if (!sim) return res.status(404).json({ error: 'Simulasi tidak ditemukan' });

    const answers = await dbAll(
      `SELECT sa.*, q.content, q.correct_answer, q.explanation, q.topic_id, q.difficulty
       FROM simulation_attempts sa JOIN questions q ON sa.question_id = q.id
       WHERE sa.simulation_id=?`,
      [simId]
    );

    const correctAnswers = answers.filter(a => a.is_correct).length;
    const totalQuestions = answers.length || sim.total_questions;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Topic performance breakdown
    const topicMap = {};
    for (const a of answers) {
      if (!topicMap[a.topic_id]) topicMap[a.topic_id] = { correct: 0, total: 0 };
      topicMap[a.topic_id].total++;
      if (a.is_correct) topicMap[a.topic_id].correct++;
    }

    // Get topic names
    const topicPerformance = [];
    for (const [topicId, stats] of Object.entries(topicMap)) {
      const topic = await dbGet('SELECT title FROM topics WHERE id=?', [topicId]);
      topicPerformance.push({
        topicId,
        topicName: topic?.title || topicId,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total,
      });
    }

    // Update simulation record
    await dbRun(
      `UPDATE simulations SET finished_at=?, correct_answers=?, status='COMPLETED' WHERE id=?`,
      [new Date().toISOString(), correctAnswers, simId]
    );

    // Award XP
    const xpEarned = await awardXP(userId, 'simulation_completed', `sim_${simId}`, XP_RULES.simulation_completed);
    await updateStreak(userId);
    await logEvent(userId, 'simulation_completed', 'simulation', simId, { accuracy, correctAnswers });
    const newBadges = await checkBadges(userId);
    const updatedUser = await dbGet('SELECT xp, level, streak FROM users WHERE id=?', [userId]);

    res.json({
      success: true,
      result: {
        accuracy,
        correctAnswers,
        totalQuestions,
        topicPerformance,
        answers,        // with correct_answer for review
        xpEarned,
        newBadges,
        student: updatedUser,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyelesaikan simulasi' });
  }
});

// ════════════════════════════════════════════════════════════
// AI TUTOR (PRD Sec. 25-27)
// ════════════════════════════════════════════════════════════

router.post('/ai/hint', async (req, res) => {
  const { questionContent, studentAnswer, attemptNumber = 1 } = req.body;

  if (!questionContent) return res.status(400).json({ error: 'Konten soal diperlukan' });

  // Fallback mock if no API key
  if (!genAI) {
    const mockHints = [
      "Coba perhatikan kembali operasi aljabar dasarnya. Apakah kamu sudah memindahkan semua konstanta ke satu sisi?",
      "Ingat prinsip: apa yang dilakukan di ruas kiri, harus dilakukan juga di ruas kanan persamaan!",
      "Coba mulai dari langkah paling awal. Apa yang sudah diketahui dari soal?",
    ];
    return res.json({ hint: mockHints[Math.min(attemptNumber - 1, 2)], isMock: true });
  }

  try {
    const prompt = `Kamu adalah AI Tutor Matematika yang membantu siswa SMP belajar.

Soal: "${questionContent}"
Jawaban siswa yang salah: "${studentAnswer || 'Belum ada jawaban'}"
Ini adalah percobaan ke-${attemptNumber}.

INSTRUKSI KETAT:
1. JANGAN berikan jawaban akhirnya.
2. JANGAN selesaikan soalnya secara penuh.
3. Berikan petunjuk (HINT) dalam 2-3 kalimat.
4. Gunakan bahasa Indonesia yang ramah, positif, dan memotivasi.
5. Petunjuk harus membantu siswa MENEMUKAN sendiri cara penyelesaiannya.

Petunjuk:`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.json({ success: true, hint: response.text });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ error: 'AI Tutor sedang tidak tersedia, coba lagi nanti.' });
  }
});

// GET Dashboard data (replaces hardcoded in index.js)
router.get('/student/dashboard', async (req, res) => {
  const userId = req.user.id;
  try {
    const student = await dbGet('SELECT id, name, level, xp, streak FROM users WHERE id=?', [userId]);
    if (!student) return res.status(404).json({ error: 'Student tidak ditemukan' });

    const progress = await dbGet('SELECT * FROM progress WHERE user_id=?', [userId]) || { aljabar: 0, geometri: 0, bilangan: 0, data_statistik: 0 };
    const badges = await dbAll('SELECT sb.*, b.name, b.icon, b.description FROM student_badges sb JOIN badges b ON sb.badge_id=b.id WHERE sb.user_id=?', [userId]);
    const istiqamah = await dbGet('SELECT * FROM istiqamah WHERE user_id=?', [userId]) || { consistency: 0, persistence: 0, improvement: 0, reflection: 0 };

    // Active quest
    const activeQuest = await dbGet(
      `SELECT sq.*, q.title, q.description, q.target_questions, q.xp_reward
       FROM student_quests sq JOIN quests q ON sq.quest_id=q.id
       WHERE sq.user_id=? AND sq.status='IN_PROGRESS' LIMIT 1`,
      [userId]
    );

    // Stats
    const totalCorrect = await dbGet('SELECT count(*) as cnt FROM question_attempts WHERE user_id=? AND is_correct=1', [userId]);
    const totalAttempts = await dbGet('SELECT count(*) as cnt FROM question_attempts WHERE user_id=?', [userId]);
    const simCount = await dbGet('SELECT count(*) as cnt FROM simulations WHERE user_id=? AND status=\'COMPLETED\'', [userId]);

    student.learningProgress = {
      aljabar: progress.aljabar,
      geometri: progress.geometri,
      bilangan: progress.bilangan,
      data_statistik: progress.data_statistik,
    };

    res.json({
      student,
      activeQuest,
      badges,
      istiqamah,
      stats: {
        totalCorrect: totalCorrect?.cnt || 0,
        totalAttempts: totalAttempts?.cnt || 0,
        accuracy: totalAttempts?.cnt > 0 ? Math.round((totalCorrect?.cnt / totalAttempts?.cnt) * 100) : 0,
        simulationsCompleted: simCount?.cnt || 0,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
