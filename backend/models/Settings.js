const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    // General settings
    siteName: {
      type: String,
      default: "ResourceHub",
    },
    siteDescription: {
      type: String,
      default: "Share resources, build community",
    },
    siteLogo: { type: String },
    siteFavicon: { type: String },

    // Contact settings
    contactEmail: { type: String },
    supportEmail: { type: String },
    contactPhone: { type: String },
    contactAddress: { type: String },

    // Social links
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      github: { type: String },
    },

    // Feature flags
    features: {
      userRegistration: { type: Boolean, default: true },
      resourceSharing: { type: Boolean, default: true },
      messaging: { type: Boolean, default: true },
      payments: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
    },

    // Moderation settings
    moderation: {
      autoApproveResources: { type: Boolean, default: false },
      requireVerification: { type: Boolean, default: true },
      maxReportsBeforeAction: { type: Number, default: 5 },
    },

    // Pricing settings
    pricing: {
      commissionRate: { type: Number, default: 0 },
      minimumDeposit: { type: Number, default: 0 },
      maximumPrice: { type: Number, default: 1000 },
    },

    // Email templates
    emailTemplates: {
      welcome: { type: String },
      verification: { type: String },
      passwordReset: { type: String },
      requestNotification: { type: String },
      returnReminder: { type: String },
    },

    // Maintenance mode
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: { type: String },
      allowedIPs: [{ type: String }],
    },

    // Updated by
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Singleton - only one settings document
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model("Settings", SettingsSchema);
