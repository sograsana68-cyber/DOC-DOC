/**
 * Stub controllers for future authentication (register, login, refresh, etc.).
 */

export function registerPlaceholder(_req, res) {
  res.status(501).json({
    error: "Not implemented",
    hint: "Wire this route to User model and hashing (e.g. bcrypt) when ready.",
  });
}

export function loginPlaceholder(_req, res) {
  res.status(501).json({
    error: "Not implemented",
    hint: "Add credentials verification and JWT or session handling here.",
  });
}
