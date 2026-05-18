const express = require('express');
const router = express.Router();
const pool = require('../database');
const n8nService = require('../services/n8n');
const whatsappService = require('../services/whatsapp');

router.post('/mercadopago', async (req, res) => {
  const { type, data } = req.body;

  if (type !== 'payment') return res.sendStatus(200);

  try {
    const payment_id = data.id;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE mp_payment_id = $1',
      [payment_id]
    );

    if (!orderResult.rows.length) return res.sendStatus(200);

    const order = orderResult.rows[0];

    await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
      ['generating', order.id]
    );

    const musicUrl = await n8nService.generateMusic(order);

    await pool.query(
      'UPDATE orders SET status = $1, music_url = $2, updated_at = NOW() WHERE id = $3',
      ['delivered', musicUrl, order.id]
    );

    await whatsappService.sendMusic(order.musician_id, order.client_phone, musicUrl);

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.sendStatus(500);
  }
});

router.post('/whatsapp', async (req, res) => {
  console.log('WhatsApp webhook:', JSON.stringify(req.body));
  res.sendStatus(200);
});

module.exports = router;