import express from "express";
import { authRouter } from "./routes/auth.js";
import { membersRouter } from "./routes/members.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/members", membersRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
