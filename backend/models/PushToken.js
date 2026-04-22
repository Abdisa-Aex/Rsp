const mongoose = require("mongoose");

const PushTokenSchema = new mongoose.Schema(
  {
    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Push token
    token: {
      type: String,
      required: true,
      unique: true,
    },

    // Platform
    platform: {
      type: String,
      enum: ["web", "ios", "android"],
      required: true,
    },

    // Device info
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      model: String,
      manufacturer: String,
      version: String,
    },

    // Active status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Last used
    lastUsed: {
      type: Date,
      default: Date.now,
    },

    // Created at
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Updated at
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
PushTokenSchema.index({ user: 1, platform: 1 });
PushTokenSchema.index({ token: 1 }, { unique: true });
PushTokenSchema.index({ lastUsed: 1 });
PushTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 },
); // Auto-expire after 90 days

// Update last used
PushTokenSchema.methods.updateLastUsed = async function () {
  this.lastUsed = new Date();
  await this.save();
  return this;
};

// Deactivate token
PushTokenSchema.methods.deactivate = async function () {
  this.isActive = false;
  await this.save();
  return this;
};

// Activate token
PushTokenSchema.methods.activate = async function () {
  this.isActive = true;
  await this.save();
  return this;
};

module.exports = mongoose.model("PushToken", PushTokenSchema);
