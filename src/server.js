import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
