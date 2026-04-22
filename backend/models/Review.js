const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    // Exchange
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
      required: true,
      index: true,
    },

    // Resource
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },

    // Participants
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review content
    review: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Response from reviewee
    response: {
      text: { type: String, maxlength: 500 },
      respondedAt: { type: Date },
    },

    // Helpfulness votes
    helpfulCount: { type: Number, default: 0 },
    helpfulVotes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        votedAt: { type: Date, default: Date.now },
      },
    ],

    // Report status
    isReported: { type: Boolean, default: false },
    reportReason: { type: String },
    reportedAt: { type: Date },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderatedAt: { type: Date },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Visibility
    isPublic: { type: Boolean, default: true },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Indexes
ReviewSchema.index({ reviewee: 1, createdAt: -1 });
ReviewSchema.index({ resource: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ moderationStatus: 1 });

// Pre-save middleware
ReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  
});

// Mark as helpful
ReviewSchema.methods.markHelpful = async function (userId) {
  if (!this.helpfulVotes.some((v) => v.user.toString() === userId.toString())) {
    this.helpfulVotes.push({ user: userId });
    this.helpfulCount += 1;
    await this.save();
  }
  return this;
};

// Unmark helpful
ReviewSchema.methods.unmarkHelpful = async function (userId) {
  this.helpfulVotes = this.helpfulVotes.filter(
    (v) => v.user.toString() !== userId.toString(),
  );
  this.helpfulCount = this.helpfulVotes.length;
  await this.save();
  return this;
};

// Add response
ReviewSchema.methods.addResponse = async function (text) {
  this.response = {
    text,
    respondedAt: new Date(),
  };
  await this.save();
  return this;
};

// Report review
ReviewSchema.methods.report = async function (userId, reason) {
  this.isReported = true;
  this.reportReason = reason;
  this.reportedAt = new Date();
  this.reportedBy = userId;
  this.moderationStatus = "pending";
  await this.save();
  return this;
};

// Moderate review
ReviewSchema.methods.moderate = async function (status, moderatorId) {
  this.moderationStatus = status;
  this.moderatedAt = new Date();
  this.moderatedBy = moderatorId;
  await this.save();
  return this;
};

module.exports = mongoose.model("Review", ReviewSchema);
