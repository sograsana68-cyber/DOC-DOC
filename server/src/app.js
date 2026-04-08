import express from "express";
import cors from "cors";
import { rootRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { getHealth } from "./controllers/health.controller.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "Family Document Vault API",
      docs: "Feature routes live under /api — see server/src/routes",
    });
  });

  app.get("/health", getHealth);

  app.use("/api", rootRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}
