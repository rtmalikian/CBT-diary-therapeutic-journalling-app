const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - modified for development
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  // In development, we need to allow eval for webpack HMR
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disabled for development
  }));
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const journalRoutes = require('./api/journal');
const authRoutes = require('./api/auth');
const emotionRoutes = require('./api/emotion');
const breathingRoutes = require('./api/breathing');
const pmrRoutes = require('./api/pmr');
const triageRoutes = require('./api/triage');

// API routes
app.use('/api/journal', journalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/breathing', breathingRoutes);
app.use('/api/pmr', pmrRoutes);
app.use('/api/triage', triageRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CBT Diary app listening at http://localhost:${PORT}`);
});

module.exports = app;