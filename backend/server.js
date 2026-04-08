require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();

  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`[Server] Listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Startup aborted:', err.message);
  process.exit(1);
});
