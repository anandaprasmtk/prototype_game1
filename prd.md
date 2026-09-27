# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Pengembangan Web-Gamification Terintegrasi AI Berbasis Nilai Istiqamah untuk Kesiapan TKA Matematika Siswa SMP

**Nama Produk:** ISTIQ-MATH
**Jenis:** Web-based Gamified Mathematics Learning Platform
**Target:** Siswa SMP
**Platform:** Responsive Web Application
**Status:** Product Development Specification
**Versi:** 1.0

---

# 1. PRODUCT OVERVIEW

## 1.1 Latar Belakang

ISTIQ-MATH merupakan platform pembelajaran matematika berbasis web yang menggabungkan:

1. Pembelajaran matematika.
2. Web-gamification.
3. Artificial Intelligence (AI).
4. Problem solving.
5. Sistem adaptif.
6. Nilai Istiqamah.
7. Latihan dan simulasi TKA Matematika.

Platform tidak dirancang sebagai website materi matematika biasa.

Gamification menjadi bagian dari **mekanisme utama pembelajaran**, sehingga siswa belajar melalui:

> Misi → Belajar → Latihan → Mendapatkan Feedback → Memperbaiki Kesalahan → Menyelesaikan Tantangan → Mendapatkan Reward → Refleksi → Melanjutkan ke Misi Berikutnya.

AI digunakan sebagai pendamping belajar, bukan sebagai mesin pemberi jawaban langsung.

Nilai Istiqamah diterjemahkan menjadi perilaku belajar yang dapat diamati, seperti:

* konsistensi belajar;
* menyelesaikan tugas;
* mencoba kembali;
* memperbaiki kesalahan;
* menyelesaikan tantangan;
* melakukan refleksi.

---

# 2. PRODUCT VISION

## 2.1 Visi

Membangun ekosistem pembelajaran matematika digital yang mendorong siswa untuk:

> **belajar secara konsisten, mampu memecahkan masalah, memperbaiki kesalahan, dan mempersiapkan diri menghadapi TKA melalui pengalaman belajar yang adaptif dan menyenangkan.**

---

# 3. PRODUCT OBJECTIVES

Platform harus mampu:

### O1 — Pembelajaran

Menyediakan pembelajaran matematika yang terstruktur.

### O2 — Gamification

Meningkatkan keterlibatan melalui:

* XP;
* level;
* quest;
* badge;
* achievement;
* streak;
* learning journey.

### O3 — AI

Memberikan:

* hint;
* feedback;
* diagnosis kesalahan;
* rekomendasi;
* adaptive learning.

### O4 — Problem Solving

Melatih proses:

1. memahami masalah;
2. menentukan strategi;
3. melakukan penyelesaian;
4. memeriksa jawaban.

### O5 — Istiqamah

Mengukur perilaku belajar yang mencerminkan:

* consistency;
* persistence;
* retry;
* improvement;
* reflection.

### O6 — TKA Preparation

Menyediakan:

* latihan;
* bank soal;
* challenge;
* simulasi;
* analisis hasil.

---

# 4. TARGET USERS

## 4.1 Student

Pengguna utama.

Fungsi:

* belajar;
* mengerjakan soal;
* mengikuti quest;
* menggunakan AI Tutor;
* melihat progress;
* mengikuti simulasi;
* melakukan refleksi.

## 4.2 Teacher

Fungsi:

* membuat materi;
* membuat soal;
* membuat quest;
* melihat perkembangan siswa;
* melihat analitik;
* memberikan intervensi.

## 4.3 Admin

Fungsi:

* mengelola pengguna;
* mengelola konten;
* mengelola sistem;
* monitoring keamanan;
* audit aktivitas.

## 4.4 Researcher

Jika platform digunakan sebagai instrumen penelitian:

* melihat data agregat;
* melihat learning analytics;
* mengevaluasi efektivitas sistem;
* melakukan export data penelitian yang telah dianonimkan.

---

# 5. INFORMATION ARCHITECTURE

Struktur utama:

```text
ISTIQ-MATH
│
├── Landing Page
│
├── Authentication
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   ├── Reset Password
│   └── Verify Email
│
├── Student Dashboard
│   ├── Overview
│   ├── Daily Quest
│   ├── Continue Learning
│   ├── Progress
│   └── AI Recommendation
│
├── Learning
│   ├── Materi
│   ├── Latihan
│   ├── Problem Solving
│   └── Review Kesalahan
│
├── Quest
│   ├── Daily Quest
│   ├── Topic Quest
│   ├── Challenge
│   └── Quest History
│
├── AI Tutor
│   ├── Ask AI
│   ├── Hint
│   ├── Feedback
│   └── Recommendation
│
├── TKA
│   ├── Practice
│   ├── Challenge
│   ├── Simulation
│   └── Results
│
├── Istiqamah
│   ├── Consistency
│   ├── Persistence
│   ├── Improvement
│   └── Reflection
│
├── Achievement
│   ├── Level
│   ├── Badge
│   └── XP
│
├── Profile
│
└── Admin/Teacher
    ├── Dashboard
    ├── Content
    ├── Question Bank
    ├── Quest Management
    ├── Student Analytics
    └── System Management
```

---

# 6. LANDING PAGE

## 6.1 Hero Section

Headline:

> **Belajar Matematika. Tantang Dirimu. Tumbuh Setiap Hari.**

Subheadline:

> Platform pembelajaran matematika berbasis AI dan gamification untuk membantu siswa SMP belajar secara konsisten dan mempersiapkan diri menghadapi TKA.

CTA:

* Mulai Belajar
* Lihat Cara Kerja

---

# 7. AUTHENTICATION

## 7.1 Register

Field:

```text
Nama
Username
Email
Password
Konfirmasi Password
Kelas
Sekolah
```

Optional:

```text
Kode Kelas
```

Kode kelas digunakan agar guru dapat menghubungkan siswa dengan kelas tertentu.

---

# 8. LOGIN

Login menggunakan:

* email/username;
* password.

Optional future:

* Google OAuth.

Security:

* password hashing;
* rate limiting;
* login attempt protection;
* session management;
* secure cookie;
* CSRF protection.

---

# 9. FORGOT PASSWORD

Flow:

```text
Forgot Password
       ↓
Input Email
       ↓
Generate Reset Token
       ↓
Send Email
       ↓
User Click Link
       ↓
New Password
       ↓
Password Hash
       ↓
Invalidate Old Token
       ↓
Login
```

Reset token:

* random;
* single-use;
* short expiration;
* stored hashed where appropriate.

---

# 10. STUDENT DASHBOARD

Dashboard:

```text
┌──────────────────────────────────────────────┐
│ Halo, Ananda 👋                             │
│ Level 4 • 520 XP • 🔥 5 hari                │
├──────────────────────────────────────────────┤
│ Misi Hari Ini                                │
│                                              │
│ [████████░░] 4/5 Quest                       │
│                                              │
│ Lanjutkan Belajar                            │
│ Persamaan Linear                             │
│ [Lanjutkan]                                  │
├──────────────────────────────────────────────┤
│ Rekomendasi AI                               │
│                                              │
│ "Coba latihan Geometri berikut..."           │
├──────────────────────────────────────────────┤
│ Progress Pembelajaran                        │
│ Aljabar       ████████░░ 78%                 │
│ Geometri      █████░░░░░ 52%                 │
│ Bilangan      ███████░░░ 68%                 │
└──────────────────────────────────────────────┘
```

### IMPORTANT

Semua angka di atas adalah **contoh data UI**, bukan angka statis.

Backend harus menghitung nilai sebenarnya.

Contoh:

```text
completed_questions = 4
daily_target = 5

progress =
4 / 5 × 100

= 80%
```

---

# 11. GAMIFICATION ENGINE

Gamification Engine merupakan inti sistem.

Komponen:

```text
XP
Level
Quest
Badge
Achievement
Streak
Reward
Learning Journey
```

---

# 12. XP SYSTEM

Contoh aturan:

| Aktivitas            |  XP |
| -------------------- | --: |
| Menyelesaikan materi | +10 |
| Menjawab soal        |  +5 |
| Menyelesaikan quest  | +20 |
| Problem solving      | +30 |
| Simulasi             | +50 |
| Refleksi             | +10 |

Nilai XP harus disimpan di backend.

Tidak boleh:

```javascript
xp += 10
```

hanya berdasarkan manipulasi frontend.

Server harus memvalidasi event.

---

# 13. XP EVENT SYSTEM

Setiap aktivitas menghasilkan event.

Contoh:

```text
lesson_completed
question_completed
quest_completed
problem_solving_completed
simulation_completed
reflection_submitted
```

Struktur:

```json
{
  "event": "question_completed",
  "studentId": "123",
  "questionId": "456",
  "timestamp": "..."
}
```

Backend kemudian melakukan validasi.

---

# 14. LEVEL SYSTEM

Contoh:

```text
Level 1 → 0–99 XP
Level 2 → 100–249 XP
Level 3 → 250–449 XP
Level 4 → 450–699 XP
Level 5 → 700–999 XP
```

Threshold dapat diubah melalui admin configuration.

Level tidak dikirim dari frontend sebagai nilai yang dipercaya.

Backend menghitung:

```text
level = calculateLevel(totalXP)
```

---

# 15. QUEST ENGINE

Quest adalah mekanisme utama gamification.

Contoh:

## Quest: Penakluk Aljabar

Requirements:

```text
✓ Pelajari Persamaan Linear
□ Kerjakan 5 soal
□ Selesaikan 1 problem solving
□ Isi refleksi
```

Status:

```text
LOCKED
AVAILABLE
IN_PROGRESS
COMPLETED
EXPIRED
```

---

# 16. DYNAMIC QUEST PROGRESS

Contoh:

```text
Target soal = 5

Selesai = 0
Progress = 0%

Selesai = 1
Progress = 20%

Selesai = 2
Progress = 40%

Selesai = 5
Progress = 100%
```

Formula:

```text
progress =
completed_requirement / total_requirement × 100
```

Backend harus menghitung progress.

Frontend hanya menampilkan.

---

# 17. QUEST COMPLETION

Quest tidak selesai karena siswa membuka halaman.

Quest selesai hanya jika:

```text
SEMUA REQUIREMENT TERPENUHI
```

Contoh:

```text
lesson_completed = true
questions_completed >= 5
problem_solving_completed = true
reflection_submitted = true
```

Kemudian:

```text
quest.status = COMPLETED
```

dan reward diberikan satu kali.

---

# 18. BADGE SYSTEM

Contoh:

### First Step

Criteria:

```text
complete_first_lesson = true
```

### Problem Solver

```text
problem_solving_completed >= 10
```

### Istiqamah

Criteria dapat menggunakan:

```text
learning_days >= X
AND
completed_tasks >= Y
AND
retry_count >= Z
```

### TKA Challenger

```text
simulation_completed >= 3
```

---

# 19. STREAK

Streak mengukur konsistensi aktivitas belajar.

Bukan:

```text
login_count
```

Tetapi:

```text
valid_learning_activity
```

Contoh valid:

* menyelesaikan soal;
* menyelesaikan materi;
* menyelesaikan quest;
* problem solving;
* refleksi.

Login saja:

```text
INVALID FOR STREAK
```

---

# 20. ISTIQAMAH ENGINE

Istiqamah tidak direpresentasikan hanya sebagai streak.

Engine terdiri dari:

```text
Consistency
+
Persistence
+
Improvement
+
Reflection
```

---

# 21. CONSISTENCY

Contoh:

```text
Student belajar:

Senin ✓
Selasa ✓
Rabu ✓
Kamis ✗
Jumat ✓
```

Backend mencatat learning activity.

---

# 22. PERSISTENCE

Contoh:

```text
Attempt 1 → salah
Attempt 2 → salah
Attempt 3 → benar
```

Sistem mencatat:

```text
retry_count = 2
successful_retry = true
```

Ini menjadi indikator persistence.

---

# 23. IMPROVEMENT

Sistem dapat membandingkan:

```text
Attempt 1 = 40%
Attempt 2 = 65%
Attempt 3 = 90%
```

Sehingga sistem dapat mencatat peningkatan performa.

---

# 24. REFLECTION

Setelah quest tertentu selesai:

```text
Apa yang paling sulit?

Apa kesalahan yang kamu temukan?

Apa yang akan kamu lakukan berbeda pada soal berikutnya?
```

Reflection menjadi learning event.

---

# 25. AI TUTOR

AI bukan sekadar chatbot.

Fungsi utama:

```text
AI Tutor
AI Hint
AI Feedback
AI Diagnosis
AI Recommendation
AI Adaptive Learning
```

---

# 26. AI HINT FLOW

Contoh:

```text
Student
   ↓
Jawaban salah
   ↓
AI mendeteksi kesalahan
   ↓
Hint 1
   ↓
Student mencoba kembali
   ↓
Masih salah
   ↓
Hint 2
   ↓
Student mencoba kembali
   ↓
Benar
```

AI tidak langsung memberikan jawaban akhir pada tahap awal bantuan.

---

# 27. AI ERROR ANALYSIS

AI dapat mengklasifikasikan:

```text
concept_error
calculation_error
strategy_error
reading_error
reasoning_error
```

Contoh:

> "Kesalahanmu kemungkinan terjadi saat mengubah bentuk persamaan. Coba periksa kembali operasi pada kedua ruas."

---

# 28. AI RECOMMENDATION ENGINE

Input:

```text
accuracy
attempt_history
topic_mastery
error_history
quest_history
learning_frequency
problem_solving_performance
```

Output:

```text
recommended_topic
recommended_question
recommended_quest
recommended_difficulty
```

Contoh:

```text
Geometry mastery = 48%

AI:
"Disarankan menyelesaikan Quest Geometri Dasar."
```

---

# 29. ADAPTIVE DIFFICULTY

Level soal:

```text
Easy
Medium
Hard
Challenge
```

Contoh aturan:

```text
accuracy > 80%
→ naik difficulty

accuracy 60–80%
→ pertahankan

accuracy < 60%
→ remedial / easier question
```

Nilai threshold harus dapat dikonfigurasi.

---

# 30. LEARNING MODULE

Struktur:

```text
Materi
 ↓
Contoh
 ↓
Latihan
 ↓
Feedback
 ↓
Problem Solving
 ↓
Review
```

Topic contoh:

```text
Bilangan
Aljabar
Geometri
Data
Peluang
```

---

# 31. PROBLEM SOLVING MODULE

Siswa tidak hanya memasukkan jawaban.

Flow:

```text
1. Memahami masalah
2. Menentukan strategi
3. Menyelesaikan
4. Memeriksa
```

Contoh:

### Step 1

Apa yang diketahui?

### Step 2

Apa yang ditanyakan?

### Step 3

Strategi apa yang digunakan?

### Step 4

Tuliskan penyelesaian.

### Step 5

Apakah jawaban masuk akal?

---

# 32. TKA PRACTICE

Fitur:

```text
Practice by Topic
Mixed Practice
Timed Practice
Challenge
```

Setiap soal menyimpan:

```text
topic
subtopic
difficulty
competency
answer
explanation
```

---

# 33. TKA SIMULATION

Flow:

```text
Start Simulation
       ↓
Question 1
       ↓
Question 2
       ↓
...
       ↓
Finish
       ↓
Evaluation
       ↓
Analysis
       ↓
Recommendation
```

Hasil:

```text
Accuracy
Topic Performance
Problem Solving Performance
Time Management
Error Pattern
```

Platform harus menggunakan istilah seperti:

> **Learning Readiness / Preparation Progress**

bukan mengklaim sebagai prediksi resmi hasil TKA.

---

# 34. PROGRESS ENGINE

Semua progress harus bersifat dynamic.

Arsitektur:

```text
DATABASE
   ↓
EVENT
   ↓
BACKEND LOGIC
   ↓
CALCULATION
   ↓
API
   ↓
FRONTEND
   ↓
PROGRESS BAR
```

---

# 35. EVENT-BASED PROGRESS

Contoh:

```text
Student completes question
        ↓
question_completed
        ↓
Backend validates
        ↓
Update attempt
        ↓
Update quest
        ↓
Update XP
        ↓
Update mastery
        ↓
Update streak
        ↓
Check badge
        ↓
Return updated state
```

---

# 36. DATABASE ARCHITECTURE

Recommended:

**PostgreSQL**

ORM:

**Prisma**

Core tables:

```text
users
profiles
roles
schools
classes

subjects
topics
subtopics
lessons

questions
question_options
question_attempts

quests
quest_requirements
student_quests

xp_transactions
levels
badges
student_badges

learning_sessions
learning_events

problem_solving_attempts
reflections

ai_conversations
ai_messages
ai_feedback

simulations
simulation_questions
simulation_attempts

mastery_records
recommendations

notifications

audit_logs
security_events
```

---

# 37. USER TABLE

```text
User
----------------
id
email
username
passwordHash
role
emailVerified
status
createdAt
updatedAt
lastLoginAt
```

---

# 38. QUESTION ATTEMPT

```text
QuestionAttempt
----------------
id
userId
questionId
answer
isCorrect
attemptNumber
timeSpent
hintUsed
aiFeedbackUsed
createdAt
```

---

# 39. XP TRANSACTION

Jangan hanya menyimpan:

```text
totalXP
```

Gunakan transaction ledger:

```text
XpTransaction
----------------
id
userId
eventType
referenceId
amount
createdAt
```

Contoh:

```text
question_completed | question_123 | +5
quest_completed     | quest_10     | +20
```

Total XP:

```text
SUM(xp_transactions.amount)
```

Ini lebih aman untuk audit.

---

# 40. LEARNING EVENT

```text
LearningEvent
----------------
id
userId
eventType
entityType
entityId
metadata
createdAt
```

Contoh:

```json
{
  "eventType": "question_completed",
  "entityType": "question",
  "entityId": "q123",
  "metadata": {
    "correct": true,
    "timeSpent": 42
  }
}
```

---

# 41. MASTERY ENGINE

Mastery tidak sama dengan progress materi.

Contoh:

```text
Materi selesai = 100%
Mastery = 62%
```

Karena mastery berdasarkan performa.

Contoh formula awal:

```text
Mastery =
0.50 × Accuracy
+
0.20 × Recent Performance
+
0.15 × Problem Solving
+
0.15 × Retention
```

Bobot tersebut merupakan parameter penelitian dan dapat diuji/diubah.

---

# 42. READINESS ENGINE

Contoh internal indicator:

```text
Readiness =
Mastery
+
Problem Solving
+
Simulation
+
Consistency
```

Misalnya:

```text
Mastery            72%
Problem Solving    65%
Simulation         70%
Consistency         80%
```

Backend menghitung indikator kesiapan.

Ini adalah **indikator pembelajaran internal platform**, bukan skor resmi TKA.

---

# 43. API ARCHITECTURE

Recommended:

```text
Frontend
   ↓
Next.js API / Backend
   ↓
Service Layer
   ↓
PostgreSQL
```

Untuk sistem yang lebih besar:

```text
Next.js
   ↓
API
   ↓
Backend Service
   ├── Auth Service
   ├── Learning Service
   ├── Gamification Service
   ├── AI Service
   ├── TKA Service
   └── Analytics Service
          ↓
      PostgreSQL
```

---

# 44. API ENDPOINTS

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
```

## Student

```http
GET /api/me
GET /api/me/dashboard
GET /api/me/progress
GET /api/me/achievements
```

## Learning

```http
GET /api/topics
GET /api/topics/:id
GET /api/lessons/:id
POST /api/lessons/:id/complete
```

## Questions

```http
GET /api/questions
POST /api/questions/:id/attempt
GET /api/questions/:id/feedback
```

## Quest

```http
GET /api/quests
GET /api/quests/:id
POST /api/quests/:id/start
GET /api/quests/:id/progress
```

## AI

```http
POST /api/ai/hint
POST /api/ai/explain
POST /api/ai/feedback
POST /api/ai/recommendation
```

## Simulation

```http
POST /api/simulations/:id/start
POST /api/simulations/:id/submit
POST /api/simulations/:id/finish
GET /api/simulations/:id/result
```

---

# 45. BACKEND SERVICE LAYER

Recommended structure:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── learning/
│   ├── questions/
│   ├── quests/
│   ├── gamification/
│   ├── ai/
│   ├── problem-solving/
│   ├── simulation/
│   ├── analytics/
│   └── notifications/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── security/
│   ├── validation/
│   └── ai/
│
└── middleware/
```

---

# 46. SECURITY ARCHITECTURE

Security menjadi bagian inti sistem karena platform menyimpan data siswa.

## Authentication Security

Gunakan:

```text
Argon2id / bcrypt
Secure session
HttpOnly cookie
Secure cookie
SameSite
Session expiration
Session rotation
```

Password tidak boleh disimpan dalam bentuk plaintext.

---

# 47. AUTHORIZATION

Gunakan Role-Based Access Control.

```text
STUDENT
TEACHER
ADMIN
RESEARCHER
```

Contoh:

```text
/student/*
→ STUDENT

/teacher/*
→ TEACHER

/admin/*
→ ADMIN
```

Student tidak boleh mengakses:

```text
/admin
/teacher
```

meskipun URL dimasukkan secara manual.

Authorization wajib dilakukan di server.

---

# 48. INPUT VALIDATION

Semua input harus divalidasi server.

Contoh:

```text
email
password
answer
questionId
questId
reflection
```

Gunakan schema validation seperti:

```text
Zod
```

---

# 49. SQL INJECTION

Gunakan ORM / parameterized query.

Jangan:

```javascript
"SELECT * FROM users WHERE id = " + userId
```

Gunakan Prisma query.

---

# 50. XSS PROTECTION

Input siswa seperti reflection harus dianggap sebagai untrusted input.

Sanitize output.

Jangan melakukan:

```text
dangerouslySetInnerHTML
```

tanpa sanitization.

---

# 51. CSRF PROTECTION

Jika authentication menggunakan cookie-based session:

```text
CSRF protection
SameSite cookies
Origin validation
```

harus diterapkan sesuai arsitektur.

---

# 52. RATE LIMITING

Endpoint sensitif:

```text
/login
/register
/forgot-password
/ai/*
```

harus memiliki rate limit.

Contoh:

```text
Login:
5 attempts / 15 minutes / IP + account

AI:
X requests / minute / user
```

Nilai final dapat dikonfigurasi berdasarkan load test.

---

# 53. AI SECURITY

AI merupakan area penting.

Jangan mengirim seluruh database siswa ke AI.

AI hanya menerima context minimum.

Contoh:

```json
{
  "topic": "Algebra",
  "question": "...",
  "studentAnswer": "...",
  "attemptNumber": 2
}
```

Tidak perlu mengirim:

```text
password
email
school identity
full profile
```

---

# 54. AI PROMPT SECURITY

System prompt AI tidak boleh dapat diubah oleh student.

Student tidak boleh dapat memerintahkan AI untuk:

```text
mengabaikan system instruction
mengakses database
mengakses credential
mengeluarkan system prompt
```

AI harus berada di server-side.

API key AI:

```text
NEVER expose to frontend
```

---

# 55. AI COST CONTROL

Gunakan:

```text
token limit
request limit
conversation limit
response caching
model routing
```

Contoh:

```text
Hint sederhana
→ model lebih ringan

Analisis problem solving
→ model lebih capable
```

---

# 56. DATA PRIVACY

Data siswa yang dikumpulkan:

```text
Identity
Learning activity
Performance
Attempts
AI interactions
Reflection
Progress
```

Harus memiliki tujuan penggunaan yang jelas.

Untuk penelitian, sebaiknya pisahkan:

```text
Operational Identity
```

dan

```text
Research Dataset
```

Research export sebaiknya menggunakan pseudonymous ID.

---

# 57. AUDIT LOG

Aktivitas sensitif dicatat.

Contoh:

```text
LOGIN_SUCCESS
LOGIN_FAILED
PASSWORD_RESET
ROLE_CHANGED
USER_CREATED
USER_DELETED
QUESTION_CREATED
QUESTION_UPDATED
QUEST_UPDATED
ADMIN_ACTION
```

Data:

```text
actorId
action
resource
resourceId
timestamp
ip
userAgent
```

---

# 58. SECURITY EVENT

Sistem harus dapat mendeteksi:

```text
multiple failed login
unusual request frequency
suspicious API usage
abnormal XP generation
repeated submission
```

Contoh:

Jika user mencoba membuat:

```text
question_completed
```

ratusan kali tanpa menyelesaikan soal,

backend tidak boleh memberikan XP berulang.

---

# 59. ANTI-CHEAT GAMIFICATION

Reward harus diberikan berdasarkan server-validated events.

Contoh:

```text
POST /question/complete
```

Backend:

```text
1. Validate user
2. Validate question
3. Validate active attempt
4. Validate answer
5. Save attempt
6. Check completion
7. Create XP transaction
8. Update quest
9. Check badge
```

Frontend tidak boleh menentukan:

```text
+50 XP
```

sendiri.

---

# 60. XP IDEMPOTENCY

Untuk mencegah double reward:

```text
unique(
  userId,
  eventType,
  referenceId
)
```

Contoh:

```text
question_completed
user 123
question 456
```

hanya dapat menghasilkan reward satu kali untuk event yang sama.

---

# 61. TRANSACTIONAL GAMIFICATION

Ketika quest selesai:

```text
BEGIN TRANSACTION

update quest
create xp transaction
update badge
create learning event

COMMIT
```

Jika terjadi error:

```text
ROLLBACK
```

Sehingga tidak terjadi:

```text
Quest belum selesai
tetapi XP sudah diberikan
```

---

# 62. FRONTEND ARCHITECTURE

Recommended:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
TanStack Query
```

Jika menggunakan Next.js App Router:

```text
app/
├── (marketing)/
├── (auth)/
├── dashboard/
├── learn/
├── quests/
├── ai/
├── tka/
├── profile/
├── teacher/
└── admin/
```

---

# 63. BACKEND TECHNOLOGY

Recommended MVP:

```text
Next.js
TypeScript
PostgreSQL
Prisma
Auth.js / secure custom session
Zod
Redis
AI API
Object Storage
```

Redis dapat digunakan untuk:

* rate limit;
* caching;
* session;
* temporary state.

---

# 64. FILE STORAGE

Materi dapat berupa:

```text
PDF
Image
Video
Worksheet
```

Gunakan object storage.

Jangan menyimpan file besar langsung di database.

---

# 65. NOTIFICATION SYSTEM

Notification:

```text
Quest tersedia
Quest hampir selesai
Badge unlocked
Level up
Reminder belajar
Feedback AI
```

Namun reminder tidak boleh memanipulasi siswa secara berlebihan.

Tujuannya mendukung konsistensi belajar.

---

# 66. TEACHER DASHBOARD

Teacher melihat:

```text
Jumlah siswa
Aktivitas
Progress
Mastery
Problem Solving
Quest completion
Common errors
```

Contoh:

```text
Class Progress

Aljabar        72%
Geometri       58%
Bilangan       81%
Data           64%
```

---

# 67. TEACHER QUESTION BANK

Guru dapat:

```text
Create
Edit
Delete
Publish
Archive
Duplicate
```

Question metadata:

```text
topic
difficulty
competency
answer
explanation
solution
tags
status
```

---

# 68. CONTENT WORKFLOW

Konten sebaiknya memiliki status:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

Guru membuat soal:

```text
DRAFT
 ↓
REVIEW
 ↓
PUBLISHED
```

Student hanya mendapatkan:

```text
PUBLISHED
```

---

# 69. ADMIN DASHBOARD

Admin:

```text
User Management
Role Management
Content Management
Quest Management
System Configuration
Security Logs
AI Usage
Analytics
```

---

# 70. RESEARCH ANALYTICS

Karena produk dapat digunakan untuk penelitian, sistem perlu menyimpan:

```text
pretest
learning activity
attempt
retry
hint usage
quest completion
reflection
posttest
simulation
```

Dengan timestamp.

Hal ini memungkinkan analisis:

```text
pretest → intervention → posttest
```

---

# 71. RESEARCH DATA EXPORT

Format:

```text
CSV
XLSX
JSON
```

Data penelitian sebaiknya:

```text
student_id → pseudonymous ID
```

bukan nama siswa jika tidak diperlukan.

---

# 72. DATA RETENTION

Admin perlu memiliki konfigurasi:

```text
retention policy
backup policy
deletion policy
```

Data yang tidak lagi diperlukan harus mengikuti kebijakan retensi yang ditetapkan institusi/penyelenggara.

---

# 73. BACKUP

Database:

```text
Daily backup
Weekly backup
Point-in-time recovery
```

Minimal:

```text
Production DB
Backup DB
```

Backup juga harus dienkripsi.

---

# 74. ENVIRONMENT

Gunakan:

```text
Development
Staging
Production
```

Jangan mengembangkan langsung pada production.

---

# 75. ENVIRONMENT VARIABLES

Contoh:

```env
DATABASE_URL=
AUTH_SECRET=
AI_API_KEY=
REDIS_URL=
STORAGE_URL=
EMAIL_API_KEY=
```

Semua secret:

```text
NEVER COMMIT TO GIT
```

Gunakan:

```text
.env.local
Secret Manager
```

---

# 76. DEPLOYMENT ARCHITECTURE

Contoh:

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │   CDN/WAF   │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Next.js   │
                │   Web/App   │
                └──────┬──────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Postgres    Redis      AI API
             │
             ▼
          Backup
```

---

# 77. SECURITY PAGE

Sediakan halaman publik:

`/security`

Isi:

### Keamanan Data

> Kami menerapkan berbagai mekanisme untuk menjaga keamanan data pengguna dan aktivitas pembelajaran.

### Account Security

* secure authentication;
* password protection;
* session management;
* access control.

### Data Protection

* encryption in transit;
* encryption at rest sesuai layanan;
* restricted database access;
* backup protection.

### Responsible AI

* AI tidak digunakan untuk menggantikan guru;
* AI memberikan bantuan pembelajaran;
* penggunaan AI dibatasi sesuai fungsi pembelajaran.

### Student Privacy

Jelaskan:

```text
Data apa yang dikumpulkan
Mengapa dikumpulkan
Bagaimana digunakan
Berapa lama disimpan
Siapa yang dapat mengakses
```

---

# 78. LEGAL / PRIVACY PAGE

Pages:

```text
/privacy
/terms
/security
/cookie-policy
```

Untuk siswa SMP, desain consent dan privacy harus memperhatikan bahwa pengguna dapat merupakan anak/minor serta kebijakan yang berlaku pada institusi dan wilayah operasional.

---

# 79. ERROR HANDLING

Frontend:

```text
Loading
Empty
Error
Success
```

Contoh:

```text
AI gagal merespons

"AI Tutor sedang mengalami gangguan.
Coba lagi beberapa saat."
```

Jangan menampilkan stack trace kepada siswa.

---

# 80. OBSERVABILITY

Gunakan:

```text
Application logs
Error monitoring
Performance monitoring
Security monitoring
AI usage monitoring
```

Metric:

```text
API latency
error rate
AI response time
database latency
active users
```

---

# 81. PERFORMANCE

Target awal:

```text
Page load cepat
API response < 500 ms untuk operasi umum
Database query teroptimasi
Lazy loading
Image optimization
Caching
```

Target final harus divalidasi melalui load testing.

---

# 82. ACCESSIBILITY

Minimal:

```text
Keyboard navigation
Readable typography
Sufficient contrast
ARIA labels
Focus states
Responsive layout
```

Gamification tidak boleh hanya menggunakan warna untuk menunjukkan status.

Contoh:

```text
✓ Completed
```

bukan hanya:

```text
warna hijau
```

---

# 83. RESPONSIVE DESIGN

Breakpoints:

```text
Mobile
Tablet
Desktop
```

Prioritas utama:

```text
Mobile-first
```

karena siswa kemungkinan besar mengakses menggunakan smartphone.

---

# 84. MAIN STUDENT FLOW

```text
REGISTER
   ↓
ONBOARDING
   ↓
DIAGNOSTIC TEST
   ↓
DASHBOARD
   ↓
DAILY QUEST
   ↓
LEARNING MATERIAL
   ↓
PRACTICE
   ↓
ANSWER
   ↓
FEEDBACK
   ↓
AI HINT
   ↓
RETRY
   ↓
PROBLEM SOLVING
   ↓
QUEST COMPLETE
   ↓
XP + BADGE
   ↓
REFLECTION
   ↓
RECOMMENDATION
   ↓
NEXT QUEST
   ↓
TKA SIMULATION
```

---

# 85. ONBOARDING

Setelah registrasi:

```text
Step 1
Profil belajar

Step 2
Diagnostic test

Step 3
Learning goal

Step 4
Recommended starting point
```

AI kemudian membuat rekomendasi awal.

---

# 86. DAILY LEARNING LOOP

Setiap hari:

```text
Open Dashboard
       ↓
Daily Quest
       ↓
Learn
       ↓
Practice
       ↓
Problem Solving
       ↓
Reward
       ↓
Reflection
```

---

# 87. DYNAMIC DASHBOARD LOGIC

Dashboard tidak boleh memiliki:

```javascript
progress = 70;
streak = 5;
mastery = 72;
```

Sebaliknya:

```text
Database
 ↓
Backend calculation
 ↓
API response
 ↓
Frontend render
```

---

# 88. SAMPLE API RESPONSE

```json
{
  "xp": 520,
  "level": 4,
  "streak": 5,
  "dailyQuest": {
    "completed": 4,
    "target": 5,
    "percentage": 80
  },
  "mastery": {
    "numbers": 0.81,
    "algebra": 0.72,
    "geometry": 0.58,
    "data": 0.64
  },
  "problemSolving": 0.67,
  "simulation": 0.71,
  "readiness": 0.68
}
```

Frontend hanya:

```text
render(data)
```

---

# 89. BUSINESS RULES

### Rule 1

Opening page tidak menghasilkan XP.

### Rule 2

Login tidak otomatis menghasilkan XP.

### Rule 3

Melihat soal tidak dianggap selesai.

### Rule 4

XP hanya diberikan melalui validated event.

### Rule 5

Quest hanya completed jika semua requirement terpenuhi.

### Rule 6

Reward tidak boleh diberikan dua kali untuk event yang sama.

### Rule 7

Progress maksimal 100%.

### Rule 8

Refresh halaman tidak mengubah progress.

### Rule 9

Student tidak dapat mengubah XP melalui frontend.

### Rule 10

Student tidak dapat mengakses teacher/admin API.

---

# 90. QUEST STATE MACHINE

```text
LOCKED
   │
   ▼
AVAILABLE
   │
   ▼
IN_PROGRESS
   │
   ├──── requirements incomplete ────┐
   │                                │
   └────────────────────────────────┘
   │
   ▼
COMPLETED
   │
   ▼
REWARD_GRANTED
```

---

# 91. QUESTION ATTEMPT STATE

```text
STARTED
   ↓
ANSWERED
   ↓
EVALUATED
   ├── CORRECT
   └── INCORRECT
          ↓
        HINT
          ↓
        RETRY
```

---

# 92. XP TRANSACTION FLOW

```text
User Action
    ↓
Validate
    ↓
Check Duplicate
    ↓
Create Learning Event
    ↓
Calculate Reward
    ↓
Create XP Transaction
    ↓
Update Quest
    ↓
Check Badge
    ↓
Return Updated State
```

---

# 93. ACCEPTANCE CRITERIA — GAMIFICATION

Sistem dianggap berhasil jika:

* XP tidak dapat dimanipulasi dari frontend.
* Quest progress berubah berdasarkan aktivitas nyata.
* XP hanya diberikan sekali untuk event yang valid.
* Level berubah berdasarkan total XP.
* Badge terbuka berdasarkan criteria.
* Refresh tidak menghilangkan progress.
* Progress berbeda sesuai aktivitas setiap siswa.

---

# 94. ACCEPTANCE CRITERIA — AI

AI harus:

* memberikan hint;
* memberikan feedback;
* membantu diagnosis;
* memberikan rekomendasi;
* tidak mengekspos secret;
* tidak memiliki akses langsung ke database;
* memiliki request limit;
* memiliki logging penggunaan.

---

# 95. ACCEPTANCE CRITERIA — SECURITY

Sistem harus:

* melakukan password hashing;
* menggunakan HTTPS di production;
* menerapkan authorization server-side;
* melakukan input validation;
* menerapkan rate limiting;
* mencatat audit log;
* menjaga API key tetap server-side;
* mencegah duplicate reward;
* melakukan backup database;
* memiliki mekanisme recovery.

---

# 96. MVP SCOPE

Versi pertama tidak perlu langsung membuat seluruh fitur kompleks.

### MVP Phase 1

```text
Authentication
Dashboard
Materi
Question Bank
Practice
XP
Level
Quest
Badge
Streak
Problem Solving
AI Hint
Progress
```

### Phase 2

```text
Adaptive Learning
AI Diagnosis
AI Recommendation
Simulation
Teacher Dashboard
Analytics
Reflection
```

### Phase 3

```text
Advanced Research Analytics
Advanced AI
Personalized Quest
Advanced Anti-Cheat
Institution Dashboard
```

---

# 97. RECOMMENDED TECH STACK

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
TanStack Query
```

## Backend

```text
Next.js API / Node.js
TypeScript
Prisma
PostgreSQL
Redis
```

## AI

```text
LLM API
Server-side AI orchestration
Prompt templates
Structured output
```

## Infrastructure

```text
Vercel / equivalent
Managed PostgreSQL
Redis
Object Storage
Email service
Monitoring
```

---

# 98. RECOMMENDED DEVELOPMENT ORDER

Jangan mengembangkan AI terlebih dahulu.

Urutan:

```text
1. Database
2. Authentication
3. User & Role
4. Learning Content
5. Question Engine
6. Attempt Engine
7. XP Engine
8. Quest Engine
9. Badge Engine
10. Dashboard
11. Problem Solving
12. Istiqamah Engine
13. AI Tutor
14. Recommendation
15. TKA Simulation
16. Teacher Dashboard
17. Analytics
18. Security Hardening
19. Testing
20. Deployment
```

---

# 99. DEVELOPMENT MILESTONE

## Sprint 1 — Foundation

```text
Project setup
Database
Authentication
RBAC
Design system
```

## Sprint 2 — Learning

```text
Topic
Material
Question
Attempt
Result
```

## Sprint 3 — Gamification

```text
XP
Level
Quest
Badge
Streak
```

## Sprint 4 — Problem Solving

```text
Problem-solving workflow
Retry
Error analysis
Reflection
```

## Sprint 5 — AI

```text
AI Tutor
Hint
Feedback
Recommendation
```

## Sprint 6 — TKA

```text
Practice
Simulation
Result
Readiness analytics
```

## Sprint 7 — Teacher/Admin

```text
Content management
Student analytics
Question management
Quest management
```

## Sprint 8 — Security & Production

```text
Security audit
Rate limiting
Logging
Backup
Load testing
Accessibility
Deployment
```

---

# 100. CORE SYSTEM DIAGRAM

```text
                         ┌─────────────────┐
                         │     STUDENT     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   WEB FRONTEND  │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   API / BACKEND │
                         └────────┬────────┘
                                  │
        ┌───────────────┬────────┼───────────┬──────────────┐
        ▼               ▼        ▼           ▼              ▼
   Learning Engine   Quest    AI Engine   TKA Engine   Analytics
        │               │        │           │              │
        └───────────────┴────────┼───────────┴──────────────┘
                                 ▼
                         ┌─────────────────┐
                         │ Gamification    │
                         │ Engine          │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Istiqamah      │
                         │ Engine         │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         └─────────────────┘
```

---

# 101. CORE PRODUCT LOOP

Sistem secara keseluruhan mengikuti:

```text
        LEARN
          ↓
       PRACTICE
          ↓
        ANSWER
          ↓
    ┌─────┴─────┐
    │           │
  BENAR       SALAH
    │           │
    │        AI HINT
    │           ↓
    │         RETRY
    │           │
    └─────┬─────┘
          ↓
    PROBLEM SOLVING
          ↓
       QUEST
       COMPLETE
          ↓
       XP/BADGE
          ↓
      REFLECTION
          ↓
       ISTIQAMAH
          ↓
     AI RECOMMENDATION
          ↓
      NEXT QUEST
          ↓
     TKA CHALLENGE
```

---

# 102. PRODUCT SUCCESS METRICS

Product dapat dievaluasi menggunakan:

### Engagement

```text
Daily Active Learners
Quest Completion Rate
Learning Session Frequency
```

### Learning

```text
Accuracy
Mastery Improvement
Problem Solving Improvement
Retry Success
```

### Gamification

```text
Quest Completion
Badge Achievement
XP Activity
Streak
```

### Istiqamah

```text
Learning Consistency
Persistence
Retry Behavior
Reflection Completion
```

### TKA Preparation

```text
Practice Performance
Simulation Performance
Topic Readiness
Problem Solving Performance
```

---

# 103. FINAL PRODUCT DEFINITION

ISTIQ-MATH bukan:

> "Website matematika + chatbot AI + poin."

Tetapi:

> **Sebuah learning system berbasis web yang menggunakan gamification sebagai mekanisme pembelajaran, AI sebagai tutor dan adaptive learning assistant, serta nilai Istiqamah sebagai kerangka perilaku belajar untuk membangun konsistensi, persistence, improvement, dan reflection dalam persiapan TKA Matematika siswa SMP.**

Struktur final:

```text
                 ISTIQ-MATH
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
   LEARNING       GAMIFICATION      AI
      │              │              │
      ▼              ▼              ▼
   Materi          XP/Level       Tutor
   Latihan         Quest          Hint
   Problem         Badge          Feedback
   Solving         Streak         Diagnosis
      │              │              │
      └──────────────┼──────────────┘
                     ▼
              ISTIQAMAH ENGINE
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
  Consistency   Persistence   Improvement
                     │
                     ▼
                 Reflection
                     │
                     ▼
              TKA PREPARATION
                     │
                     ▼
             LEARNING READINESS
```

# 104. PRINCIPLE UTAMA IMPLEMENTASI

Ada satu prinsip yang harus dijaga selama development:

> **Frontend menampilkan keadaan. Backend menentukan keadaan. Database menyimpan keadaan. Event mengubah keadaan.**

Dengan demikian:

```text
Student completes activity
        ↓
EVENT
        ↓
Backend validation
        ↓
Database transaction
        ↓
Gamification calculation
        ↓
AI/adaptive calculation
        ↓
Updated progress
        ↓
Frontend
```

Bukan:

```text
Student clicks button
        ↓
Frontend langsung menambah XP
```

Karena prinsip ini akan menentukan apakah sistem benar-benar merupakan **web-gamification yang dapat dipertanggungjawabkan secara teknis dan dapat digunakan sebagai platform penelitian**, bukan sekadar mockup tampilan.
