

const mongoose = require("mongoose");


const {
  RESOURCE_STATUS,
  RESOURCE_CONDITIONS,
  PRICE_TYPES,
} = require("../config/constants");

const ResourceSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Categorization
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    subcategory: { type: String },
    tags: [{ type: String, index: true }],

    // Location
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Media
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    video: { type: String },
    videoThumbnail: { type: String },

    // Pricing
    priceType: {
      type: String,
      enum: Object.values(PRICE_TYPES),
      default: PRICE_TYPES.FREE,
    },
    price: { type: Number, default: 0, min: 0 },
    priceUnit: { type: String, enum: ["day", "week", "month"], default: "day" },
    deposit: { type: Number, default: 0, min: 0 },
    weeklyDiscount: { type: Number, default: 0, min: 0, max: 100 },
    monthlyDiscount: { type: Number, default: 0, min: 0, max: 100 },

    // Condition & Details
    condition: {
      type: String,
      enum: Object.values(RESOURCE_CONDITIONS),
      default: RESOURCE_CONDITIONS.GOOD,
    },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    age: { type: String },
    serialNumber: { type: String, sparse: true },
    warrantyInfo: { type: String },

    // Specifications (flexible schema for different resource types)
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Features
    features: [{ type: String }],
    includedItems: [{ type: String }],

    // Availability
    status: {
      type: String,
      enum: Object.values(RESOURCE_STATUS),
      default: RESOURCE_STATUS.AVAILABLE,
      index: true,
    },
    availabilityDates: {
      start: { type: Date },
      end: { type: Date },
    },
    availabilitySchedule: {
      monday: { available: Boolean, from: String, to: String },
      tuesday: { available: Boolean, from: String, to: String },
      wednesday: { available: Boolean, from: String, to: String },
      thursday: { available: Boolean, from: String, to: String },
      friday: { available: Boolean, from: String, to: String },
      saturday: { available: Boolean, from: String, to: String },
      sunday: { available: Boolean, from: String, to: String },
    },
    holidays: [
      {
        date: Date,
        reason: String,
      },
    ],

    // Rental Terms
    rentalTerms: {
      minDays: { type: Number, default: 1, min: 1 },
      maxDays: { type: Number },
      insuranceRequired: { type: Boolean, default: false },
      deliveryAvailable: { type: Boolean, default: false },
      deliveryFee: { type: Number, default: 0 },
      pickupAvailable: { type: Boolean, default: true },
      requiresDeposit: { type: Boolean, default: false },
    },

    // Statistics
    views: { type: Number, default: 0, index: true },
    uniqueViews: [{ type: String }],
    requests: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },

    // Reviews
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    // Flags
    isVerified: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPremium: { type: Boolean, default: false },

    // Moderation
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "approved",
      index: true,
    },
    moderationNotes: { type: String },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderatedAt: { type: Date },
    rejectionReason: { type: String },

    // Expiration
    expiresAt: { type: Date, index: true },
    isExpired: { type: Boolean, default: false },

    // Price History
    priceHistory: [
      {
        price: Number,
        priceType: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    // Status History
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        reason: String,
      },
    ],

    // Timestamps
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },
    lastRequestedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for search and filtering
ResourceSchema.index({ title: "text", description: "text", tags: "text" });
ResourceSchema.index({ category: 1, status: 1 });
ResourceSchema.index({ location: "text" });
ResourceSchema.index({ coordinates: "2dsphere" });
ResourceSchema.index({ price: 1 });
ResourceSchema.index({ rating: -1 });
ResourceSchema.index({ views: -1 });
ResourceSchema.index({ createdAt: -1 });
ResourceSchema.index({ isVerified: 1, isTrending: 1, isFeatured: 1 });
ResourceSchema.index({ owner: 1, status: 1 });
ResourceSchema.index({ expiresAt: 1 });
ResourceSchema.index({ slug: 1 }, { unique: true, sparse: true });

// ✅ FIXED: Pre-save middleware - ASYNC VERSION (no 'next' parameter)
ResourceSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  if (this.isNew) {
    this.publishedAt = Date.now();
    if (!this.priceHistory) this.priceHistory = [];
    this.priceHistory.push({
      price: this.price,
      priceType: this.priceType,
      changedAt: new Date(),
    });
  }

  // Track price changes
  if (this.isModified("price") || this.isModified("priceType")) {
    if (!this.priceHistory) this.priceHistory = [];
    this.priceHistory.push({
      price: this.price,
      priceType: this.priceType,
      changedAt: new Date(),
    });
    // Keep only last 20 price changes
    if (this.priceHistory.length > 20) {
      this.priceHistory = this.priceHistory.slice(-20);
    }
  }

  // Track status changes
  if (this.isModified("status")) {
    if (!this.statusHistory) this.statusHistory = [];
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
    // Keep only last 10 status changes
    if (this.statusHistory.length > 10) {
      this.statusHistory = this.statusHistory.slice(-10);
    }
  }

  // Generate slug from title
  if ((this.isModified("title") || !this.slug) && this.title) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Add random suffix for uniqueness
    this.slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
  }
});

ResourceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const Exchange = mongoose.model("Exchange");
    // Delete all exchanges associated with this resource
    await Exchange.deleteMany({ resource: this._id });
    console.log(`Deleted exchanges for resource ${this._id}`);
  },
);

// For deleteMany operations
ResourceSchema.pre("deleteMany", async function () {
  const Exchange = mongoose.model("Exchange");
  const resourcesToDelete = await this.model.find(this.getFilter());
  const resourceIds = resourcesToDelete.map((r) => r._id);
  await Exchange.deleteMany({ resource: { $in: resourceIds } });
});
// Virtual for primary image
ResourceSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary ? primary.url : this.images[0]?.url || null;
});

// Virtual for all image URLs
ResourceSchema.virtual("imageUrls").get(function () {
  return this.images.map((img) => img.url);
});

// Virtual for formatted price
ResourceSchema.virtual("formattedPrice").get(function () {
  if (this.priceType === PRICE_TYPES.FREE) return "Free";
  if (this.priceType === PRICE_TYPES.DEPOSIT) return `$${this.deposit} deposit`;
  if (this.priceType === PRICE_TYPES.BARTER) return "Barter / Trade";
  return `$${this.price}/${this.priceUnit}`;
});

// Virtual for availability text
ResourceSchema.virtual("availabilityText").get(function () {
  switch (this.status) {
    case RESOURCE_STATUS.AVAILABLE:
      return "Available Now";
    case RESOURCE_STATUS.BORROWED:
      return "Currently Borrowed";
    case RESOURCE_STATUS.PENDING:
      return "Pending Approval";
    case RESOURCE_STATUS.MAINTENANCE:
      return "Under Maintenance";
    default:
      return "Not Available";
  }
});

// Increment views (with unique tracking)
ResourceSchema.methods.incrementViews = async function (identifier = null) {
  if (identifier && !this.uniqueViews.includes(identifier)) {
    this.uniqueViews.push(identifier);
    this.views += 1;
    await this.save();
  } else if (!identifier) {
    this.views += 1;
    await this.save();
  }
  return this.views;
};

// Update rating
ResourceSchema.methods.updateRating = async function () {
  const Review = mongoose.model("Review");
  const reviews = await Review.find({ resource: this._id, isApproved: true });

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
  this.totalRatings = reviews.length;

  await this.save();
  return this.rating;
};

// Check availability for a date range
ResourceSchema.methods.isAvailableForDates = async function (
  startDate,
  endDate,
) {
  if (this.status !== RESOURCE_STATUS.AVAILABLE) return false;

  const Exchange = mongoose.model("Exchange"); // ✅ Keep this
  const overlappingExchanges = await Exchange.findOne({
    resource: this._id,
    status: { $in: ["approved", "active"] },
    $or: [
      { startDate: { $lte: endDate, $gte: startDate } },
      { endDate: { $lte: endDate, $gte: startDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  });

  return !overlappingExchanges;
};

// Check availability for a specific date
ResourceSchema.methods.isAvailableForDate = async function (date) {
  return this.isAvailableForDates(date, date);
};

// Calculate price for duration
ResourceSchema.methods.calculatePrice = function (days) {
  if (this.priceType === PRICE_TYPES.FREE) return 0;
  if (this.priceType === PRICE_TYPES.DEPOSIT) return this.deposit;
  if (this.priceType === PRICE_TYPES.BARTER) return 0;

  let total = this.price * days;

  // Apply weekly discount
  if (days >= 7 && this.weeklyDiscount > 0) {
    const weeks = Math.floor(days / 7);
    total -= this.price * 7 * weeks * (this.weeklyDiscount / 100);
  }

  // Apply monthly discount
  if (days >= 30 && this.monthlyDiscount > 0) {
    const months = Math.floor(days / 30);
    total -= this.price * 30 * months * (this.monthlyDiscount / 100);
  }

  return Math.max(0, total);
};

// Update trending status
ResourceSchema.methods.updateTrending = async function () {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const Exchange = mongoose.model("Exchange"); // ✅ Add this line
  const recentRequests = await Exchange.countDocuments({
    // ✅ Use Exchange
    resource: this._id,
    createdAt: { $gte: weekAgo },
  });

  const wasTrending = this.isTrending;
  this.isTrending = recentRequests > 10;

  if (wasTrending !== this.isTrending) {
    await this.save();
  }

  return this.isTrending;
};
// Get similar resources
ResourceSchema.methods.getSimilarResources = async function (limit = 5) {
  const Resource = mongoose.model("Resource");
  return await Resource.find({
    category: this.category,
    _id: { $ne: this._id },
    status: RESOURCE_STATUS.AVAILABLE,
    moderationStatus: "approved",
  })
    .limit(limit)
    .sort({ rating: -1, views: -1 })
    .populate("owner", "fullName avatar rating trustScore");
};

// Soft delete
ResourceSchema.methods.softDelete = async function () {
  this.status = RESOURCE_STATUS.DELETED;
  this.deletedAt = new Date();
  await this.save();
};

// Restore
ResourceSchema.methods.restore = async function () {
  this.status = RESOURCE_STATUS.AVAILABLE;
  this.deletedAt = null;
  await this.save();
};
ResourceSchema.set("toJSON", { virtuals: false });
ResourceSchema.set("toObject", { virtuals: false });
module.exports = mongoose.model("Resource", ResourceSchema);