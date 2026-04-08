const mongoose = require("mongoose");
const Member = require("../models/Member");

async function requireMemberOwner(req, res, next) {
  try {
    const { memberId } = req.params;
    if (!memberId) {
      return res.status(400).json({ error: "memberId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid memberId" });
    }
    const member = await Member.findOne({
      _id: memberId,
      userId: req.userId,
    });
    if (!member) {
      return res.status(404).json({ error: "Member not found or access denied" });
    }
    req.member = member;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireMemberOwner };
