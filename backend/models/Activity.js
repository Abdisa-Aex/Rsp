// models/Activity.js
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "borrowed",
        "shared",
        "reviewed",
        "joined",
        "returned",
        "messaged",
      ],
      required: true,
    },
    item: {
      type: String,
      trim: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
    user: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
ActivitySchema.index({ user: 1, action: 1 });
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ action: 1 });

module.exports = mongoose.model("Activity", ActivitySchema);
