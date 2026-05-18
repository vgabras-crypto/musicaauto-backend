const axios = require('axios');

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_KEY = process.env.EVOLUTION_KEY;

async function sendMusic(musician_id, client_phone, music_url) {
  const instanceName = `musician_${musician_id}`;
  try {
    await axios.post(`${EVOLUTION_URL}/message/sendMedia/${instanceName}`, {
      number: client_phone,
      mediatype: 'audio',
      media: music_url,
      caption: 'Aqui está sua música personalizada! 🎵'
    }, {
      headers: { apikey: EVOLUTION_KEY }
    });
  } catch (err) {
    console.error('Erro ao enviar música:', err.message);
    throw err;
  }
}

async function sendText(musician_id, client_phone, text) {
  const instanceName = `musician_${musician_id}`;
  try {
    await axios.post(`${EVOLUTION_URL}/message/sendText/${instanceName}`, {
      number: client_phone,
      text
    }, {
      headers: { apikey: EVOLUTION_KEY }
    });
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err.message);
    throw err;
  }
}

module.exports = { sendMusic, sendText };