const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Document = require("../models/Document");
const Member = require("../models/Member");
const { authRequired } = require("../middleware/auth");
const { requireMemberOwner } = require("../middleware/memberAccess");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authRequired);

router.post(
  "/upload/:memberId",
  requireMemberOwner,
  upload.single("file"),
  body("title").trim().notEmpty(),
  body("type").trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "file is required (multipart field name: file)" });
      }

      const { title, type } = req.body;
      const memberId = req.member._id;

      const folder = `doc-doc/members/${memberId}`;
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const doc = await Document.create({
        title,
        type,
        fileUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        memberId,
        uploadedAt: new Date(),
      });

      return res.status(201).json(doc);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:memberId", requireMemberOwner, async (req, res, next) => {
  try {
    const docs = await Document.find({ memberId: req.member._id }).sort({
      uploadedAt: -1,
    });
    return res.json(docs);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid document id" });
    }
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    const member = await Member.findOne({
      _id: doc.memberId,
      userId: req.userId,
    });
    if (!member) {
      return res.status(404).json({ error: "Document not found or access denied" });
    }

    await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
      resource_type: "auto",
    });
    await doc.deleteOne();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
