const mongoose = require("mongoose");
const { EXCHANGE_STATUS } = require("../config/constants");

const ExchangeSchema = new mongoose.Schema(
  {
    // Resource
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },

    // Participants
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Dates
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: { type: Date },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    canceledAt: { type: Date },
    completedAt: { type: Date },

    // Duration
    duration: { type: Number }, // in days

    // Pricing
    price: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    discountReason: { type: String },

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "disputed", "failed"],
      default: "pending",
    },
    paymentId: { type: String },
    paymentMethod: { type: String },
    paidAt: { type: Date },
    refundAmount: { type: Number },
    refundedAt: { type: Date },
    refundReason: { type: String },

    // Status
    status: {
      type: String,
      enum: Object.values(EXCHANGE_STATUS),
      default: EXCHANGE_STATUS.PENDING,
      index: true,
    },

    // Messages
    message: { type: String, maxlength: 1000 },
    pickupInstructions: { type: String, maxlength: 500 },
    returnInstructions: { type: String, maxlength: 500 },

    // Photos
    pickupPhotos: [
      {
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    returnPhotos: [
      {
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // Condition on pickup/return
    pickupCondition: {
      type: String,
      enum: ["excellent", "good", "fair", "damaged"],
      default: "good",
    },
    returnCondition: {
      type: String,
      enum: ["excellent", "good", "fair", "damaged"],
      default: "good",
    },
    returnNotes: { type: String, maxlength: 500 },

    // Rating
    ownerRating: { type: Number, min: 1, max: 5 },
    borrowerRating: { type: Number, min: 1, max: 5 },
    ownerReview: { type: String, maxlength: 500 },
    borrowerReview: { type: String, maxlength: 500 },
    ownerTags: [{ type: String }], // ← ADD THIS LINE
    borrowerTags: [{ type: String }], // ← ADD THIS LINE
    ownerRatedAt: { type: Date },
    borrowerRatedAt: { type: Date },

    // Dispute
    disputeReason: { type: String },
    disputeDetails: { type: String },
    disputedAt: { type: Date },
    disputedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolution: { type: String },
    resolutionDetails: { type: String },

    // Notifications
    ownerNotified: { type: Boolean, default: false },
    borrowerNotified: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    reminderCount: { type: Number, default: 0 },
    lastReminderSent: { type: Date },

    // Extension requests
    extensionRequests: [
      {
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        newEndDate: Date,
        reason: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
        respondedAt: Date,
        respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

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
ExchangeSchema.index({ resource: 1, status: 1 });
ExchangeSchema.index({ owner: 1, status: 1 });
ExchangeSchema.index({ borrower: 1, status: 1 });
ExchangeSchema.index({ startDate: 1, endDate: 1 });
ExchangeSchema.index({ createdAt: -1 });
ExchangeSchema.index({ status: 1, endDate: 1 });
ExchangeSchema.index({ paymentStatus: 1 });

// Pre-save middleware
ExchangeSchema.pre("save", function () {
  this.updatedAt = Date.now();
  if (this.startDate && this.endDate) {
    this.duration = Math.ceil(
      (this.endDate - this.startDate) / (1000 * 60 * 60 * 24),
    );
  }
});

// Calculate total amount
ExchangeSchema.pre("save", async function (next) {
  if (
    this.isModified("price") ||
    this.isModified("duration") ||
    this.isModified("discountAmount")
  ) {
    const subtotal = this.price * this.duration;
    this.totalAmount = subtotal - this.discountAmount + (this.deposit || 0);
  }
});

// Check if exchange is active
ExchangeSchema.virtual("isActive").get(function () {
  return this.status === EXCHANGE_STATUS.ACTIVE && this.endDate >= new Date();
});

// Check if exchange is overdue
ExchangeSchema.virtual("isOverdue").get(function () {
  return this.status === EXCHANGE_STATUS.ACTIVE && this.endDate < new Date();
});

// Get days remaining
ExchangeSchema.virtual("daysRemaining").get(function () {
  if (!this.isActive) return 0;
  const remaining = Math.ceil(
    (this.endDate - new Date()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, remaining);
});

// Get days overdue
ExchangeSchema.virtual("daysOverdue").get(function () {
  if (!this.isOverdue) return 0;
  const overdue = Math.ceil(
    (new Date() - this.endDate) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, overdue);
});

// Approve exchange
ExchangeSchema.methods.approve = async function () {
  this.status = EXCHANGE_STATUS.APPROVED;
  this.approvedAt = new Date();
  await this.save();
  return this;
};

// Activate exchange
ExchangeSchema.methods.activate = async function () {
  this.status = EXCHANGE_STATUS.ACTIVE;
  await this.save();

  // Update resource status
  const Resource = mongoose.model("Resource");
  await Resource.findByIdAndUpdate(this.resource, { status: "borrowed" });

  return this;
};

// Complete exchange
ExchangeSchema.methods.complete = async function (
  returnCondition,
  returnPhotos,
  returnNotes,
) {
  this.status = EXCHANGE_STATUS.COMPLETED;
  this.actualReturnDate = new Date();
  this.returnCondition = returnCondition;
  this.returnPhotos = returnPhotos || [];
  this.returnNotes = returnNotes;
  this.completedAt = new Date();
  await this.save();

  // Update resource status
  const Resource = mongoose.model("Resource");
  await Resource.findByIdAndUpdate(this.resource, { status: "available" });

  // Update user stats
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(this.owner, {
    $inc: { "stats.successfulExchanges": 1 },
  });
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { "stats.successfulExchanges": 1 },
  });

  // Award points
  await this.awardPoints();

  return this;
};

// Cancel exchange
ExchangeSchema.methods.cancel = async function (reason, canceledBy) {
  this.status = EXCHANGE_STATUS.CANCELED;
  this.canceledAt = new Date();
  await this.save();

  // Update user stats
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(this.owner, {
    $inc: { "stats.canceledExchanges": 1 },
  });
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { "stats.canceledExchanges": 1 },
  });

  // Refund if paid
  if (this.paymentStatus === "paid") {
    await this.refund("Exchange canceled");
  }

  return this;
};

// Award points to participants
ExchangeSchema.methods.awardPoints = async function () {
  const { POINTS } = require("../config/constants");
  const User = mongoose.model("User");

  // Award points to owner for sharing
  await User.findByIdAndUpdate(this.owner, {
    $inc: { points: POINTS.SHARE_ITEM },
  });

  // Award points to borrower for borrowing
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { points: POINTS.BORROW_ITEM },
  });

  // Award points for completion
  await User.findByIdAndUpdate(this.owner, {
    $inc: { points: POINTS.COMPLETE_EXCHANGE },
  });
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { points: POINTS.COMPLETE_EXCHANGE },
  });

  // Update carbon savings
  const Resource = mongoose.model("Resource");
  const resource = await Resource.findById(this.resource);
  const carbonSaved = 5; // kg per exchange

  await User.findByIdAndUpdate(this.owner, {
    $inc: { "stats.carbonSaved": carbonSaved },
  });
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { "stats.carbonSaved": carbonSaved },
  });

  // Update savings
  const savings = this.totalAmount;
  await User.findByIdAndUpdate(this.owner, {
    $inc: { "stats.totalSavings": savings },
  });
  await User.findByIdAndUpdate(this.borrower, {
    $inc: { "stats.totalSavings": savings },
  });

  // Update user stats
  await User.findById(this.owner).then((u) => u.updateStats());
  await User.findById(this.borrower).then((u) => u.updateStats());
};

// Add review
ExchangeSchema.methods.addReview = async function (userId, rating, review) {
  const isOwner = this.owner.toString() === userId.toString();

  if (isOwner) {
    this.ownerRating = rating;
    this.ownerReview = review;
    this.ownerRatedAt = new Date();
  } else {
    this.borrowerRating = rating;
    this.borrowerReview = review;
    this.borrowerRatedAt = new Date();
  }

  await this.save();

  // Create review in database
  const Review = mongoose.model("Review");
  await Review.create({
    exchange: this._id,
    reviewer: userId,
    reviewee: isOwner ? this.borrower : this.owner,
    resource: this.resource,
    rating,
    review,
    isPublic: true,
  });

  // Update user rating
  const User = mongoose.model("User");
  await User.findById(isOwner ? this.borrower : this.owner).then((u) =>
    u.updateStats(),
  );

  return this;
};

// Request extension
ExchangeSchema.methods.requestExtension = async function (
  userId,
  newEndDate,
  reason,
) {
  const isOwner = this.owner.toString() === userId.toString();
  const requestedBy = isOwner ? this.owner : this.borrower;

  this.extensionRequests.push({
    requestedBy,
    newEndDate,
    reason,
    status: "pending",
  });

  await this.save();
  return this;
};

// Approve extension
ExchangeSchema.methods.approveExtension = async function (requestId, adminId) {
  const request = this.extensionRequests.id(requestId);
  if (!request) throw new Error("Extension request not found");
  if (request.status !== "pending")
    throw new Error("Request already processed");

  request.status = "approved";
  request.respondedAt = new Date();
  request.respondedBy = adminId;

  this.endDate = request.newEndDate;
  this.duration = Math.ceil(
    (this.endDate - this.startDate) / (1000 * 60 * 60 * 24),
  );

  // Recalculate total amount
  const subtotal = this.price * this.duration;
  this.totalAmount = subtotal - this.discountAmount + (this.deposit || 0);

  await this.save();
  return this;
};

// Reject extension
ExchangeSchema.methods.rejectExtension = async function (requestId, adminId) {
  const request = this.extensionRequests.id(requestId);
  if (!request) throw new Error("Extension request not found");
  if (request.status !== "pending")
    throw new Error("Request already processed");

  request.status = "rejected";
  request.respondedAt = new Date();
  request.respondedBy = adminId;

  await this.save();
  return this;
};

// Process payment
ExchangeSchema.methods.processPayment = async function (
  paymentId,
  paymentMethod,
) {
  this.paymentStatus = "paid";
  this.paymentId = paymentId;
  this.paymentMethod = paymentMethod;
  this.paidAt = new Date();
  await this.save();
  return this;
};

// Process refund
ExchangeSchema.methods.refund = async function (reason, amount = null) {
  this.paymentStatus = "refunded";
  this.refundAmount = amount || this.totalAmount;
  this.refundedAt = new Date();
  this.refundReason = reason;
  await this.save();
  return this;
};

// Mark as disputed
ExchangeSchema.methods.markDisputed = async function (userId, reason, details) {
  this.status = EXCHANGE_STATUS.DISPUTED;
  this.disputeReason = reason;
  this.disputeDetails = details;
  this.disputedAt = new Date();
  this.disputedBy = userId;
  await this.save();
  return this;
};

// Resolve dispute
ExchangeSchema.methods.resolveDispute = async function (
  adminId,
  resolution,
  details,
) {
  this.resolvedAt = new Date();
  this.resolvedBy = adminId;
  this.resolution = resolution;
  this.resolutionDetails = details;
  await this.save();
  return this;
};

// Send reminder
ExchangeSchema.methods.sendReminder = async function () {
  this.reminderSent = true;
  this.reminderCount += 1;
  this.lastReminderSent = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model("Exchange", ExchangeSchema);
