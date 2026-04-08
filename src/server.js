require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");
const authRoutes = require("./routes/auth");
const membersRoutes = require("./routes/members");
const documentsRoutes = require("./routes/documents");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/documents", documentsRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT) || 3000;

async function main() {
  configureCloudinary();
  await connectDb();
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
