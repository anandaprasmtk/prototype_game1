/**
 * Gamification Engine (SQLite-backed)
 * PRD Sec. 11-19: XP, Level, Quest, Badge, Streak
 * PRD Sec. 39: XP Transaction Ledger (idempotent)
 * PRD Sec. 59-60: Anti-cheat, no double reward
 */

const { dbRun, dbGet, dbAll } = require('./database');

const XP_RULES = {
  lesson_completed: 10,
  question_correct: 5,
  question_correct_first_try: 8,   // bonus for first try
  quest_completed: 25,
  problem_solving_completed: 15,
  simulation_completed: 50,
  reflection_submitted: 10,
};

function calculateLevel(totalXp) {
  if (totalXp < 100) return 1;
  if (totalXp < 250) return 2;
  if (totalXp < 500) return 3;
  if (totalXp < 800) return 4;
  if (totalXp < 1200) return 5;
  return 6;
}

function xpForNextLevel(totalXp) {
  const thresholds = [100, 250, 500, 800, 1200];
  for (const t of thresholds) {
    if (totalXp < t) return t;
  }
  return 9999;
}

/**
 * Award XP using idempotent ledger (PRD Sec. 60)
 * Returns xpEarned (0 if duplicate)
 */
async function awardXP(userId, eventType, referenceId, amount) {
  try {
    const refId = referenceId || `${userId}_${eventType}_${Date.now()}`;
    await dbRun(
      `INSERT OR IGNORE INTO xp_transactions (user_id, event_type, reference_id, amount, created_at) VALUES (?,?,?,?,?)`,
      [userId, eventType, refId, amount, new Date().toISOString()]
    );
    // Check if insert was a no-op (duplicate)
    const check = await dbGet(
      `SELECT amount FROM xp_transactions WHERE user_id=? AND event_type=? AND reference_id=?`,
      [userId, eventType, refId]
    );
    const xpEarned = check ? amount : 0;

    // Recalculate total XP from ledger and update user
    const totals = await dbGet('SELECT SUM(amount) as total FROM xp_transactions WHERE user_id=?', [userId]);
    const totalXp = totals?.total || 0;
    const newLevel = calculateLevel(totalXp);
    await dbRun('UPDATE users SET xp=?, level=? WHERE id=?', [totalXp, newLevel, userId]);

    return xpEarned;
  } catch (err) {
    console.error('awardXP error:', err);
    return 0;
  }
}

/**
 * Update streak (PRD Sec. 19)
 */
async function updateStreak(userId) {
  const user = await dbGet('SELECT last_active_date, streak FROM users WHERE id=?', [userId]);
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];
  if (user.last_active_date === today) return; // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = user.last_active_date === yesterday ? user.streak + 1 : 1;

  await dbRun('UPDATE users SET streak=?, last_active_date=? WHERE id=?', [newStreak, today, userId]);
  // Increment consistency in istiqamah
  await dbRun('INSERT OR IGNORE INTO istiqamah (user_id) VALUES (?)', [userId]);
  await dbRun('UPDATE istiqamah SET consistency = consistency + 1 WHERE user_id=?', [userId]);
}

/**
 * Check and award badges (PRD Sec. 18)
 */
async function checkBadges(userId) {
  const newBadges = [];

  const correctAnswers = await dbGet(
    `SELECT count(*) as cnt FROM question_attempts WHERE user_id=? AND is_correct=1`, [userId]
  );
  if (correctAnswers?.cnt >= 1) {
    const r = await dbRun(
      `INSERT OR IGNORE INTO student_badges (user_id, badge_id, earned_at) VALUES (?,?,?)`,
      [userId, 'b1', new Date().toISOString()]
    );
    if (r.changes > 0) newBadges.push('b1');
  }

  // Check persistence badge (correct after 3+ attempts on same question)
  const persistBadge = await dbGet(
    `SELECT question_id FROM question_attempts WHERE user_id=? AND is_correct=1 AND attempt_number >= 3 LIMIT 1`,
    [userId]
  );
  if (persistBadge) {
    const r = await dbRun(
      `INSERT OR IGNORE INTO student_badges (user_id, badge_id, earned_at) VALUES (?,?,?)`,
      [userId, 'b2', new Date().toISOString()]
    );
    if (r.changes > 0) newBadges.push('b2');
  }

  // Check problem solving badge
  const psBadge = await dbGet(
    `SELECT id FROM problem_solving_attempts WHERE user_id=? AND is_complete=1 LIMIT 1`, [userId]
  );
  if (psBadge) {
    const r = await dbRun(
      `INSERT OR IGNORE INTO student_badges (user_id, badge_id, earned_at) VALUES (?,?,?)`,
      [userId, 'b4', new Date().toISOString()]
    );
    if (r.changes > 0) newBadges.push('b4');
  }

  // Check quest badge
  const questBadge = await dbGet(
    `SELECT id FROM student_quests WHERE user_id=? AND status='COMPLETED' LIMIT 1`, [userId]
  );
  if (questBadge) {
    const r = await dbRun(
      `INSERT OR IGNORE INTO student_badges (user_id, badge_id, earned_at) VALUES (?,?,?)`,
      [userId, 'b3', new Date().toISOString()]
    );
    if (r.changes > 0) newBadges.push('b3');
  }

  // Check simulation badge
  const simBadge = await dbGet(
    `SELECT id FROM simulations WHERE user_id=? AND status='COMPLETED' LIMIT 1`, [userId]
  );
  if (simBadge) {
    const r = await dbRun(
      `INSERT OR IGNORE INTO student_badges (user_id, badge_id, earned_at) VALUES (?,?,?)`,
      [userId, 'b5', new Date().toISOString()]
    );
    if (r.changes > 0) newBadges.push('b5');
  }

  return newBadges;
}

/**
 * Check if active quests are completed (PRD Sec. 90)
 */
async function checkAndCompleteQuests(userId) {
  const activeQuests = await dbAll(
    `SELECT sq.*, q.target_questions, q.xp_reward, q.id as quest_id
     FROM student_quests sq
     JOIN quests q ON sq.quest_id = q.id
     WHERE sq.user_id=? AND sq.status='IN_PROGRESS'`,
    [userId]
  );

  const completedQuestIds = [];
  for (const sq of activeQuests) {
    const isComplete = sq.lesson_completed &&
      sq.questions_completed >= sq.target_questions &&
      sq.problem_solving_completed &&
      sq.reflection_submitted;

    if (isComplete) {
      await dbRun(
        `UPDATE student_quests SET status='COMPLETED', completed_at=? WHERE user_id=? AND quest_id=?`,
        [new Date().toISOString(), userId, sq.quest_id]
      );
      // Award XP (idempotent via ledger)
      await awardXP(userId, 'quest_completed', sq.quest_id, sq.xp_reward);
      completedQuestIds.push(sq.quest_id);
    }
  }
  return completedQuestIds;
}

/**
 * Log a learning event (PRD Sec. 40)
 */
async function logEvent(userId, eventType, entityType, entityId, metadata = {}) {
  await dbRun(
    `INSERT INTO events (user_id, event_type, entity_type, entity_id, metadata, created_at) VALUES (?,?,?,?,?,?)`,
    [userId, eventType, entityType, entityId, JSON.stringify(metadata), new Date().toISOString()]
  );
}

module.exports = { awardXP, calculateLevel, xpForNextLevel, updateStreak, checkBadges, checkAndCompleteQuests, logEvent, XP_RULES };
