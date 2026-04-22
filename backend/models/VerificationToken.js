const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["email_verification", "password_reset", "email_change"],
    default: "email_verification",
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expiresAfterSeconds: 0 },
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mark as used
VerificationTokenSchema.methods.markAsUsed = async function () {
  this.used = true;
  this.usedAt = new Date();
  await this.save();
  return this;
};

// Check if expired
VerificationTokenSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

module.exports = mongoose.model("VerificationToken", VerificationTokenSchema);
