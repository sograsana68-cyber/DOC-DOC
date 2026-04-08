import "dotenv/config";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

const app = createApp();

async function start() {
  if (mongoUri) {
    try {
      await connectDb(mongoUri);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1);
    }
  } else {
    console.warn(
      "MONGODB_URI is not set — start MongoDB and copy server/.env.example to server/.env"
    );
  }

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start();
