const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  // User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // Token type
  type: {
    type: String,
    enum: [
      "email_verification",
      "password_reset",
      "email_change",
      "session",
      "api_key",
    ],
    required: true,
  },

  // Token value
  token: {
    type: String,
    required: true,
    unique: true,
  },

  // Expiration
  expiresAt: {
    type: Date,
    required: true,
    index: { expiresAfterSeconds: 0 },
  },

  // Whether token has been used
  used: {
    type: Boolean,
    default: false,
  },

  // Used at
  usedAt: { type: Date },

  // IP address of requester
  ip: { type: String },

  // User agent
  userAgent: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
});

// Indexes
TokenSchema.index({ token: 1 });
TokenSchema.index({ user: 1, type: 1 });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if token is expired
TokenSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Mark as used
TokenSchema.methods.markAsUsed = async function () {
  this.used = true;
  this.usedAt = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model("Token", TokenSchema);
