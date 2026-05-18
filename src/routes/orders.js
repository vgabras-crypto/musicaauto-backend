const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  const { musician_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE musician_id = $1 ORDER BY created_at DESC LIMIT 20',
      [musician_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { musician_id, client_name, client_phone, occasion, style, value } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO orders (musician_id, client_name, client_phone, occasion, style, value, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'awaiting_payment')
      RETURNING *
    `, [musician_id, client_name, client_phone, occasion, style, value]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, music_url } = req.body;
  try {
    await pool.query(
      'UPDATE orders SET status = $1, music_url = $2, updated_at = NOW() WHERE id = $3',
      [status, music_url, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;