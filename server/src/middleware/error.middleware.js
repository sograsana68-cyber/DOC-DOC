/**
 * Central error handler. Add auth-specific handlers beside this file later.
 */
export function errorHandler(err, _req, res, _next) {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}
