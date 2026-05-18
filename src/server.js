const express = require('express');
const cors = require('cors');
require('dotenv').config();

const whatsappRoutes = require('./routes/whatsapp');
const configRoutes = require('./routes/config');
const ordersRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhook');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/config', configRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/webhook', webhookRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'MúsicaAuto backend rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});