// In-memory Database Simulation
// Ini digunakan untuk prototyping. Di produksi, gunakan PostgreSQL/MySQL.

const db = {
  students: {
    "student_1": {
      id: "student_1",
      name: "Ananda",
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      learningProgress: {
        aljabar: 0, // percentage
        geometri: 0,
        bilangan: 0
      },
      istiqamah: {
        consistency: 0, // days learned
        persistence: 0, // successful retries
        improvement: 0, // positive score diffs
        reflection: 0 // completed reflections
      }
    }
  },
  quests: {
    "student_1": [
      {
        id: "q1",
        title: "Penakluk Aljabar",
        status: "IN_PROGRESS",
        requirements: {
          lesson_completed: false,
          questions_completed: 0,
          target_questions: 5,
          problem_solving_completed: false,
          reflection_submitted: false
        },
        rewardXp: 20
      }
    ]
  },
  events: [] // event log for audit
};

module.exports = db;
