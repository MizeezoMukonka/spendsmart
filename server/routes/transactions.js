const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('req.user:', req.user); // debug
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET transactions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('req.user:', req.user); // debug
    console.log('req.headers:', req.headers.authorization); // debug
    const { type, amount, category, description, date } = req.body;
    const result = await pool.query(
      'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, type, amount, category, description, date || new Date().toISOString().split('T')[0]]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST transaction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE transaction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;