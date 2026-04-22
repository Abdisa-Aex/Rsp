const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    // Type of reported content
    targetType: {
      type: String,
      enum: ["resource", "user", "message", "review"],
      required: true,
    },

    // ID of the reported content
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Resource", "User", "Message", "Review"],
    },

    // Reporter
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Report details
    reason: {
      type: String,
      required: true,
      enum: [
        "spam",
        "inappropriate_content",
        "harassment",
        "fake_item",
        "wrong_category",
        "incorrect_info",
        "scam",
        "copyright",
        "other",
      ],
    },
    details: {
      type: String,
      maxlength: 1000,
    },

    // Evidence
    evidence: [
      {
        type: String,
        url: String,
        description: String,
      },
    ],

    // Status
    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },

    // Resolution
    resolution: {
      action: {
        type: String,
        enum: [
          "warning",
          "content_removed",
          "user_suspended",
          "user_banned",
          "no_action",
        ],
      },
      notes: String,
      resolvedAt: { type: Date },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Assigned moderator
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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
ReportSchema.index({ targetType: 1, targetId: 1 });
ReportSchema.index({ reporter: 1 });
ReportSchema.index({ status: 1, priority: 1 });
ReportSchema.index({ assignedTo: 1 });

// Pre-save middleware
ReportSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
 
});

// Assign to moderator
ReportSchema.methods.assignTo = async function (moderatorId) {
  this.assignedTo = moderatorId;
  this.status = "reviewing";
  await this.save();
  return this;
};

// Resolve report
ReportSchema.methods.resolve = async function (action, notes, moderatorId) {
  this.status = "resolved";
  this.resolution = {
    action,
    notes,
    resolvedAt: new Date(),
    resolvedBy: moderatorId,
  };
  await this.save();
  return this;
};

// Dismiss report
ReportSchema.methods.dismiss = async function (notes, moderatorId) {
  this.status = "dismissed";
  this.resolution = {
    action: "no_action",
    notes,
    resolvedAt: new Date(),
    resolvedBy: moderatorId,
  };
  await this.save();
  return this;
};

module.exports = mongoose.model("Report", ReportSchema);
