import { Router } from "express";
import { loginPlaceholder, registerPlaceholder } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", registerPlaceholder);
authRouter.post("/login", loginPlaceholder);
