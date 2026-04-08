const express = require("express");
const { body, validationResult } = require("express-validator");
const Member = require("../models/Member");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.use(authRequired);

router.post(
  "/",
  body("displayName").optional().isString().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { displayName } = req.body;
    const member = await Member.create({
      userId: req.userId,
      displayName: displayName ?? "",
    });
    return res.status(201).json(member);
  }
);

router.get("/", async (req, res) => {
  const members = await Member.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  return res.json(members);
});

module.exports = router;
