import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const membersRouter = Router();

membersRouter.use(requireAuth);

membersRouter.post("/", async (req: Request, res: Response) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const relation = typeof req.body?.relation === "string" ? req.body.relation.trim() : "";

  if (!name || !relation) {
    res.status(400).json({ error: "name and relation are required" });
    return;
  }

  const userId = req.userId!;
  const member = await prisma.familyMember.create({
    data: {
      name,
      relation,
      userId,
    },
  });

  res.status(201).json(member);
});

membersRouter.get("/", async (req: Request, res: Response) => {
  const userId = req.userId!;
  const members = await prisma.familyMember.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(members);
});

membersRouter.delete("/:id", async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const userId = req.userId!;
  const result = await prisma.familyMember.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    res.status(404).json({ error: "not found" });
    return;
  }

  res.status(204).send();
});
