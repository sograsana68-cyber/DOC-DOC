import { db } from "../db.js";

export function findUserByEmail(email) {
  return db
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .get(email);
}

export function createUser({ name, email, passwordHash }) {
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
    )
    .run(name, email, passwordHash);
  return { id: result.lastInsertRowid, name, email };
}
