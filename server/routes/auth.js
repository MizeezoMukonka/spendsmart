const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
require('dotenv').config();

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required')
  .isLength({ min: 3 }).withMessage('Name must be at least 3 characters')
  .matches(/^[a-zA-Z\s]+$/).withMessage('Name should only contain letters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('pin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('PIN must be exactly 4 digits'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { name, email, phone, password, pin } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Please provide either an email or phone number' });
  }

  try {
    if (email) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (exists.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });
    }
    if (phone) {
      const exists = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
      if (exists.rows.length > 0) return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password, pin) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone',
      [name, email || null, phone || null, hashedPassword, hashedPin]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { identifier, password } = req.body; // identifier = email OR phone

  if (!identifier) return res.status(400).json({ error: 'Please enter your email or phone number' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $1',
      [identifier]
    );
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid login details' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid login details' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify PIN
router.post('/verify-pin', [
  body('pin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('PIN must be 4 digits'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { userId, pin } = req.body;
  try {
    const result = await pool.query('SELECT pin FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const validPin = await bcrypt.compare(pin, result.rows[0].pin);
    if (!validPin) return res.status(400).json({ error: 'Incorrect PIN' });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change PIN
router.post('/change-pin', [
  body('currentPin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Current PIN must be 4 digits'),
  body('newPin').isLength({ min: 4, max: 4 }).isNumeric().withMessage('New PIN must be 4 digits'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { userId, currentPin, newPin } = req.body;
  try {
    const result = await pool.query('SELECT pin FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const validPin = await bcrypt.compare(currentPin, result.rows[0].pin);
    if (!validPin) return res.status(400).json({ error: 'Current PIN is incorrect' });

    const hashedNewPin = await bcrypt.hash(newPin, 10);
    await pool.query('UPDATE users SET pin = $1 WHERE id = $2', [hashedNewPin, userId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;