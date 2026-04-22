const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    username: { type: String, unique: true, sparse: true, trim: true },
    userType: { type: String, default: "external" },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    location: { type: String },
    campusAddress: { type: String },
    roomNumber: { type: String },

    // Verification fields for magic link
    emailVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, sparse: true },
    verificationExpires: { type: Date },

    // Magic link login fields
    magicToken: { type: String, sparse: true },
    magicExpires: { type: Date },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Student specific
    studentId: { type: String, sparse: true },
    department: { type: String },
    yearOfStudy: { type: String },
    graduationYear: { type: String },

    // Referral
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Stats
    points: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },

    stats: {
      itemsShared: { type: Number, default: 0 },
      itemsBorrowed: { type: Number, default: 0 },
      successfulExchanges: { type: Number, default: 0 },
      canceledExchanges: { type: Number, default: 0 },
      responseRate: { type: Number, default: 0 },
      avgResponseTime: { type: Number, default: 0 },
      totalSavings: { type: Number, default: 0 },
      carbonSaved: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      profileViews: { type: Number, default: 0 },
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "super_admin"],
      default: "user",
    },
    permissions: [{ type: String }],

    // Security
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    twoFactorBackupCodes: [{ type: String }],

    // Status
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    bannedUntil: { type: Date },
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
    deletionScheduledAt: { type: Date },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedAt: { type: Date },
    // Tokens
    refreshTokens: [
      {
        token: { type: String },
        device: { type: String },
        ip: { type: String },
        userAgent: { type: String },
        expiresAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Add to UserSchema
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
    notificationPreferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        messages: true,
        requests: true,
        returns: true,
        reviews: true,
        promotions: false,
        system: true,
      },
    },
    emailChangePending: {
      newEmail: String,
      code: String,
      expiresAt: Date,
    },
    // Push tokens
    pushTokens: [
      {
        token: { type: String },
        platform: { type: String, enum: ["web", "ios", "android"] },
        deviceInfo: { type: mongoose.Schema.Types.Mixed },
        lastUsed: { type: Date, default: Date.now },
      },
    ],

    // Preferences
    preferences: {
      notifications: {
        messages: { type: Boolean, default: true },
        requests: { type: Boolean, default: true },
        returns: { type: Boolean, default: true },
        reviews: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        system: { type: Boolean, default: true },
      },
      privacy: {
        showEmail: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: true },
        showLastSeen: { type: Boolean, default: true },
        showPoints: { type: Boolean, default: true },
      },
      language: { type: String, default: "en" },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
    },

    // Interests & Skills
    interests: [{ type: String }],
    skills: [{ type: String }],
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },

    // Bookmarks
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],

    // Badges
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],

    // Achievements
    achievements: [
      {
        id: { type: String },
        earnedAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
      },
    ],

    // Blocked users
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Login attempts
    loginAttempts: {
      count: { type: Number, default: 0 },
      lastAttempt: { type: Date },
      lockUntil: { type: Date },
    },

    // Online status
    online: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    lastLogin: { type: Date },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ referralCode: 1 });
UserSchema.index({ studentId: 1 });
UserSchema.index({ isBanned: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ "stats.itemsShared": -1 });
UserSchema.index({ trustScore: -1 });
UserSchema.index({ createdAt: -1 });

// FIXED: Correct pre-save middleware (NO next parameter needed in async functions)
UserSchema.pre("save", async function () {
  // Update updatedAt
  this.updatedAt = Date.now();

  // Generate referral code if new user and doesn't have one
  if (this.isNew && !this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  // Hash password if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate magic link verification token (for email verification)
UserSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Generate magic link login token
UserSchema.methods.generateMagicLoginToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.magicToken = token;
  this.magicExpires = Date.now() + 15 * 60 * 1000;
  return token;
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return token;
};

// Generate email change code
UserSchema.methods.generateEmailChangeCode = function (newEmail) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailChangePending = {
    newEmail,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  return code;
};

// Check if account is locked
UserSchema.methods.isLocked = function () {
  return (
    this.loginAttempts.lockUntil && this.loginAttempts.lockUntil > Date.now()
  );
};

// Get lockout remaining time
UserSchema.methods.getLockoutRemaining = function () {
  if (!this.loginAttempts.lockUntil) return 0;
  return Math.max(0, this.loginAttempts.lockUntil - Date.now());
};

// Record login attempt
UserSchema.methods.recordLoginAttempt = async function (
  success,
  ip,
  userAgent,
  deviceName,
) {
  if (success) {
    this.loginAttempts = { count: 0, lastAttempt: null, lockUntil: null };
    this.lastLogin = new Date();
    this.online = true;
  } else {
    this.loginAttempts.count += 1;
    this.loginAttempts.lastAttempt = new Date();

    if (this.loginAttempts.count >= 5) {
      this.loginAttempts.lockUntil = Date.now() + 15 * 60 * 1000;
    }
  }
  await this.save();
  return this;
};

// Check if password was changed after token issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Update user stats
UserSchema.methods.updateStats = async function () {
  const Resource = mongoose.model("Resource");
  const Exchange = mongoose.model("Exchange");

  const itemsShared = await Resource.countDocuments({
    owner: this._id,
    status: { $ne: "deleted" },
  });
  const itemsBorrowed = await Exchange.countDocuments({
    borrower: this._id,
    status: "completed",
  });
  const successfulExchanges = await Exchange.countDocuments({
    $or: [{ owner: this._id }, { borrower: this._id }],
    status: "completed",
  });

  const trustScore = Math.min(
    100,
    Math.floor(successfulExchanges * 10 + this.rating * 10 + this.points / 100),
  );

  this.stats = {
    itemsShared,
    itemsBorrowed,
    successfulExchanges,
    canceledExchanges: this.stats?.canceledExchanges || 0,
    responseRate: this.stats?.responseRate || 0,
    avgResponseTime: this.stats?.avgResponseTime || 0,
    totalSavings: this.stats?.totalSavings || 0,
    carbonSaved: this.stats?.carbonSaved || 0,
    totalViews: this.stats?.totalViews || 0,
    profileViews: this.stats?.profileViews || 0,
  };

  this.trustScore = trustScore;
  await this.save();
  return this;
};

// Get profile completion percentage
UserSchema.virtual("profileCompletion").get(function () {
  let completed = 0;
  let total = 8;

  if (this.fullName) completed++;
  if (this.bio) completed++;
  if (this.phone) completed++;
  if (this.location) completed++;
  if (this.avatar) completed++;
  if (this.interests?.length) completed++;
  if (this.skills?.length) completed++;
  if (this.emailVerified) completed++;

  return Math.round((completed / total) * 100);
});

// Check if user has permission
UserSchema.methods.hasPermission = function (permission) {
  if (this.role === "super_admin") return true;
  if (this.role === "admin" && permission !== "manage_roles") return true;
  return this.permissions?.includes(permission) || false;
};

module.exports = mongoose.model("User", UserSchema);