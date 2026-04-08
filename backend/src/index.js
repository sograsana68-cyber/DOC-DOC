import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const PORT = Number(process.env.PORT) || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

const passwordHash = bcrypt.hashSync("password123", 10);

const users = [
  {
    id: "user-1",
    email: "demo@example.com",
    passwordHash,
  },
];

const familyMembers = [
  {
    id: "m1",
    name: "Alex Rivera",
    relation: "Self",
    documents: [
      { id: "d1", title: "Passport", updatedAt: "2025-01-10" },
      { id: "d2", title: "Insurance card", updatedAt: "2025-02-01" },
    ],
  },
  {
    id: "m2",
    name: "Jordan Lee",
    relation: "Partner",
    documents: [
      { id: "d3", title: "Driver license", updatedAt: "2024-11-20" },
    ],
  },
  {
    id: "m3",
    name: "Sam Rivera",
    relation: "Child",
    documents: [
      { id: "d4", title: "Birth certificate", updatedAt: "2023-06-15" },
      { id: "d5", title: "School enrollment", updatedAt: "2025-03-01" },
    ],
  },
];

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.sub, email: req.user.email } });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get("/api/family-members", authMiddleware, (_req, res) => {
  const list = familyMembers.map(({ id, name, relation }) => ({ id, name, relation }));
  res.json(list);
});

app.get("/api/family-members/:memberId/documents", authMiddleware, (req, res) => {
  const member = familyMembers.find((m) => m.id === req.params.memberId);
  if (!member) {
    return res.status(404).json({ error: "Family member not found" });
  }
  res.json({ memberId: member.id, memberName: member.name, documents: member.documents });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
