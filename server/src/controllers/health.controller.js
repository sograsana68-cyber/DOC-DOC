import { getConnectionState } from "../config/db.js";

const READY_CONNECTED = 1;

export function getHealth(_req, res) {
  res.json({
    ok: true,
    service: "family-document-vault-api",
    mongo: getConnectionState() === READY_CONNECTED ? "connected" : "disconnected",
  });
}
