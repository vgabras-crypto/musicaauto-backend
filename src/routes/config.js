const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  const { musician_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM musician_config WHERE musician_id = $1',
      [musician_id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  const { musician_id, price, delivery_time, welcome_message, pix_key } = req.body;
  try {
    await pool.query(`
      INSERT INTO musician_config (musician_id, price, delivery_time, welcome_message, pix_key)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (musician_id) DO UPDATE
      SET price = $2, delivery_time = $3, welcome_message = $4, pix_key = $5, updated_at = NOW()
    `, [musician_id, price, delivery_time, welcome_message, pix_key]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;