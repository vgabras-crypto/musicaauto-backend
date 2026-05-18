const axios = require('axios');

async function generateMusic(order) {
  try {
    const response = await axios.post(process.env.N8N_WEBHOOK_URL, {
      order_id: order.id,
      client_name: order.client_name,
      occasion: order.occasion,
      style: order.style,
      message: order.message
    });

    return response.data.music_url;
  } catch (err) {
    console.error('Erro ao chamar n8n:', err.message);
    throw err;
  }
}

module.exports = { generateMusic };