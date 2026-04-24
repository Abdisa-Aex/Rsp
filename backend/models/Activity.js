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
    // ⚠️ FIXED: Duplicate 'user' field - renamed to 'userName'
    userName: {
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
    // ✅ ADDED: Likes functionality
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
ActivitySchema.index({ user: 1, action: 1 });
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ action: 1 });
// ✅ ADDED: Index for likes sorting
ActivitySchema.index({ likes: -1 });

// ✅ ADDED: Method to check if user liked activity
ActivitySchema.methods.isLikedBy = function (userId) {
  return (
    this.likedBy &&
    this.likedBy.some((id) => id.toString() === userId.toString())
  );
};

// ✅ ADDED: Method to toggle like
ActivitySchema.methods.toggleLike = async function (userId) {
  const index = this.likedBy.findIndex(
    (id) => id.toString() === userId.toString(),
  );

  if (index === -1) {
    // Add like
    this.likedBy.push(userId);
    this.likes = (this.likes || 0) + 1;
  } else {
    // Remove like
    this.likedBy.splice(index, 1);
    this.likes = Math.max(0, (this.likes || 0) - 1);
  }

  await this.save();
  return {
    liked: index === -1,
    likes: this.likes,
  };
};

module.exports = mongoose.model("Activity", ActivitySchema);
