const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signUserToken } = require("../utils/jwt");

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash });
    const token = signUserToken(user._id.toString());
    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signUserToken(user._id.toString());
    return res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  }
);

module.exports = router;
