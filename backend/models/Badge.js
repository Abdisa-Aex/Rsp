const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },

    // Visual Elements
    icon: {
      type: String,
      default: "🏆",
    },
    iconComponent: {
      type: String,
      default: "Award",
    },
    color: {
      type: String,
      default: "from-yellow-500 to-amber-500",
    },
    backgroundColor: {
      type: String,
      default: "bg-yellow-100",
    },
    textColor: {
      type: String,
      default: "text-yellow-800",
    },
    imageUrl: {
      type: String,
    },

    // Badge Level/Rarity
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    // Points Awarded
    points: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Requirements
    requirementType: {
      type: String,
      enum: [
        "items_shared",
        "items_borrowed",
        "exchanges_completed",
        "trust_score",
        "points",
        "years_member",
        "reviews_received",
        "positive_reviews",
        "response_rate",
        "carbon_saved",
        "money_saved",
        "referrals_made",
        "profile_completion",
        "verification_status",
        "special_event",
      ],
      required: true,
    },
    requirementValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Additional Requirements (for complex badges)
    additionalRequirements: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Category
    category: {
      type: String,
      enum: [
        "sharing",
        "community",
        "achievement",
        "special",
        "verification",
        "milestone",
      ],
      default: "achievement",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isLimited: {
      type: Boolean,
      default: false,
    },
    limitedUntil: {
      type: Date,
    },

    // User Progress Tracking
    totalEarned: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
BadgeSchema.index({ name: 1 });
BadgeSchema.index({ slug: 1 });
BadgeSchema.index({ level: 1 });
BadgeSchema.index({ category: 1 });
BadgeSchema.index({ requirementType: 1, requirementValue: 1 });

// Pre-save middleware
BadgeSchema.pre("save", function (next) {
  // Generate slug from name
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  this.updatedAt = Date.now();
  
});

// Virtual for formatted name with emoji
BadgeSchema.virtual("formattedName").get(function () {
  return `${this.icon} ${this.name}`;
});

// Virtual for CSS classes
BadgeSchema.virtual("cssClasses").get(function () {
  return {
    container: `${this.backgroundColor} ${this.textColor}`,
    icon: `text-${this.color.split("-")[1]}-500`,
    gradient: `bg-gradient-to-r ${this.color}`,
  };
});

// Method to check if user qualifies for badge
BadgeSchema.methods.checkQualification = async function (userId) {
  const User = mongoose.model("User");
  const user = await User.findById(userId);

  if (!user) return false;

  let meetsRequirement = false;

  switch (this.requirementType) {
    case "items_shared":
      meetsRequirement = user.stats.itemsShared >= this.requirementValue;
      break;
    case "items_borrowed":
      meetsRequirement = user.stats.itemsBorrowed >= this.requirementValue;
      break;
    case "exchanges_completed":
      meetsRequirement =
        user.stats.successfulExchanges >= this.requirementValue;
      break;
    case "trust_score":
      meetsRequirement = user.trustScore >= this.requirementValue;
      break;
    case "points":
      meetsRequirement = user.points >= this.requirementValue;
      break;
    case "years_member":
      const yearsMember =
        (Date.now() - new Date(user.createdAt).getTime()) /
        (1000 * 60 * 60 * 24 * 365);
      meetsRequirement = yearsMember >= this.requirementValue;
      break;
    case "reviews_received":
      meetsRequirement = user.totalRatings >= this.requirementValue;
      break;
    case "positive_reviews":
      const positiveRate = user.rating / 5;
      meetsRequirement = positiveRate >= this.requirementValue / 100;
      break;
    case "response_rate":
      meetsRequirement = user.stats.responseRate >= this.requirementValue;
      break;
    case "carbon_saved":
      meetsRequirement = user.stats.carbonSaved >= this.requirementValue;
      break;
    case "money_saved":
      meetsRequirement = user.stats.totalSavings >= this.requirementValue;
      break;
    case "referrals_made":
      meetsRequirement = (user.referrals?.length || 0) >= this.requirementValue;
      break;
    case "profile_completion":
      meetsRequirement = user.profileCompletion >= this.requirementValue;
      break;
    case "verification_status":
      meetsRequirement = user.isVerified === true;
      break;
    default:
      meetsRequirement = false;
  }

  return meetsRequirement;
};

// Static method to award badge to user
BadgeSchema.statics.awardToUser = async function (badgeId, userId) {
  const User = mongoose.model("User");
  const user = await User.findById(userId);
  const badge = await this.findById(badgeId);

  if (!user || !badge) return false;

  // Check if user already has this badge
  if (user.badges.includes(badgeId)) {
    return false;
  }

  // Add badge to user
  user.badges.push(badgeId);
  user.points += badge.points;
  await user.save();

  // Increment badge stats
  badge.totalEarned += 1;
  badge.totalUsers += 1;
  await badge.save();

  // Create notification
  const Notification = mongoose.model("Notification");
  await Notification.create({
    user: userId,
    type: "achievement",
    title: "New Badge Earned! 🎉",
    message: `You've earned the "${badge.name}" badge!`,
    data: { badgeId, badgeName: badge.name, points: badge.points },
    actionUrl: `/profile/badges`,
    priority: "high",
  });

  return true;
};

// Static method to check and award all badges for a user
BadgeSchema.statics.checkAndAwardAll = async function (userId) {
  const badges = await this.find({ isActive: true, isHidden: false });
  const awarded = [];

  for (const badge of badges) {
    const qualifies = await badge.checkQualification(userId);
    if (qualifies) {
      const awarded_badge = await this.awardToUser(badge._id, userId);
      if (awarded_badge) awarded.push(badge.name);
    }
  }

  return awarded;
};

module.exports = mongoose.model("Badge", BadgeSchema);
