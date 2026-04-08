import { Router } from "express";
import { listDocumentsPlaceholder } from "../controllers/api.controller.js";

export const apiRouter = Router();

apiRouter.get("/documents", listDocumentsPlaceholder);
