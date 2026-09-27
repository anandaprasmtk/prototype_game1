const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('./database');
const crypto = require('crypto');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'istiqmath_super_secret_key_2026';

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    
    // Validate input
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "Semua kolom wajib diisi." });
    }

    // Check existing user
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser) {
      return res.status(400).json({ error: "Email atau Username sudah terdaftar." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate ID
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert user
    await dbRun(`INSERT INTO users (id, name, username, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?)`, 
      [userId, name, username, email, hashedPassword, now]);
    
    // Init istiqamah and progress
    await dbRun(`INSERT INTO istiqamah (user_id) VALUES (?)`, [userId]);
    await dbRun(`INSERT INTO progress (user_id) VALUES (?)`, [userId]);

    res.status(201).json({ success: true, message: "Registrasi berhasil." });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi." });
    }

    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: "Kredensial tidak valid." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Kredensial tidak valid." });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Akses ditolak, token tidak ada." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid." });
  }
};

module.exports = { router, authMiddleware };
