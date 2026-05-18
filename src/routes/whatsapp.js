const express = require('express');
const router = express.Router();
const axios = require('axios');

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_KEY = process.env.EVOLUTION_KEY;

router.post('/connect', async (req, res) => {
  const { musician_id } = req.body;
  const instanceName = `musician_${musician_id}`;
  try {
    await axios.post(`${EVOLUTION_URL}/instance/create`, {
      instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS'
    }, {
      headers: { apikey: EVOLUTION_KEY }
    });
    res.json({ success: true, instance: instanceName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/qrcode', async (req, res) => {
  const { musician_id } = req.query;
  const instanceName = `musician_${musician_id}`;
  try {
    const response = await axios.get(
      `${EVOLUTION_URL}/instance/connect/${instanceName}`,
      { headers: { apikey: EVOLUTION_KEY } }
    );
    res.json({ qrcode: response.data.base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status', async (req, res) => {
  const { musician_id } = req.query;
  const instanceName = `musician_${musician_id}`;
  try {
    const response = await axios.get(
      `${EVOLUTION_URL}/instance/connectionState/${instanceName}`,
      { headers: { apikey: EVOLUTION_KEY } }
    );
    res.json({ status: response.data.instance?.state });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;