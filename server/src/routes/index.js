import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { apiRouter } from "./api.routes.js";

export const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/", apiRouter);
