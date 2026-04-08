const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using MONGODB_URI from the environment.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || typeof uri !== 'string' || !uri.trim()) {
    const err = new Error(
      'MONGODB_URI is missing or empty. Set it in your environment (e.g. .env).'
    );
    console.error('[DB] Connection error:', err.message);
    throw err;
  }

  try {
    const conn = await mongoose.connect(uri);
    const host = conn.connection.host;
    console.log(`[DB] Successfully connected to MongoDB Atlas (host: ${host})`);
    return conn;
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB Atlas:', err.message);
    throw err;
  }
}

module.exports = connectDB;
