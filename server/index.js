const express = require('express');
const cors = require('cors');
const { router: authRouter, authMiddleware } = require('./auth');
const learningRouter = require('./learning');

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes (public)
app.use('/api/auth', authRouter);

// All other API routes: protected by JWT middleware
app.use('/api', authMiddleware, learningRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
