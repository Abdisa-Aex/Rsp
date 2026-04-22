const mongoose = require("mongoose");
const { NOTIFICATION_TYPES } = require("../config/constants");

const NotificationSchema = new mongoose.Schema(
  {
    // Recipient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Type
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      index: true,
    },

    // Content
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    body: { type: String },

    // Data payload
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Action
    actionUrl: { type: String },
    actionLabel: { type: String },

    // Image/Icon
    image: { type: String },
    icon: { type: String },

    // Priority
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    // Status
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    delivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    clicked: { type: Boolean, default: false },
    clickedAt: { type: Date },

    // Expiration
    expiresAt: { type: Date },

    // For grouping
    groupId: { type: String },

    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Indexes
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ groupId: 1 });

// Pre-save middleware
NotificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  
});

// Mark as read
NotificationSchema.methods.markAsRead = async function () {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Mark as delivered
NotificationSchema.methods.markAsDelivered = async function () {
  if (!this.delivered) {
    this.delivered = true;
    this.deliveredAt = new Date();
    await this.save();
  }
  return this;
};

// Mark as clicked
NotificationSchema.methods.markAsClicked = async function () {
  if (!this.clicked) {
    this.clicked = true;
    this.clickedAt = new Date();
    await this.save();
  }
  return this;
};

// Check if expired
NotificationSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < new Date();
};

// Format for API response
NotificationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.isExpired = this.isExpired();
  return obj;
};

module.exports = mongoose.model("Notification", NotificationSchema);
