require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security headers
app.use(helmet());

// Compress all responses
app.use(compression());

// Logging
app.use(morgan('dev'));

// Rate limiting — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Stricter rate limit for auth routes — max 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' }
});

// CORS
app.use(cors({
  origin: '*'
}));

// Parse JSON — limit body size to 10kb to prevent attacks
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Handle routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on our end.' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ SpendSmart API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});