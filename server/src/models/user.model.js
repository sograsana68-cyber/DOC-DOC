import mongoose from "mongoose";

/**
 * Placeholder user model for future authentication (e.g. password hash, JWT).
 * Extend fields when you add signup/login.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // passwordHash: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
