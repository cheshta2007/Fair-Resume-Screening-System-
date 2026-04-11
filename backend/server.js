const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const seedData = require('./utils/seedData');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["https://frontend-beige-two-nrlu80lisp.vercel.app", "https://y-gold-two-66.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
    seedData();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

connectToDatabase();

// Health-check / graceful failure handling for serverless runtime
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/api/health' || req.path.startsWith('/uploads')) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Service temporarily unavailable. Database is not connected.',
    });
  }

  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Fair Resume Screening API is running 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    mode: process.env.NODE_ENV || 'development'
  });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const jobRoutes = require('./routes/jobs');
const chatbotRoutes = require('./routes/chatbotRoute');

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Server start logic (Vercel Compatible)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
