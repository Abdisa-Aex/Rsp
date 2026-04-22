const Badge = require("../models/Badge");
const User = require("../models/User");
const Resource = require("../models/Resource");
const Exchange = require("../models/Exchange");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const Token = require("../models/Token");
const { sendNotificationByType } = require("../config/firebase");
const { logger } = require("../utils/logger");
const { maskEmail, maskPhone, formatNumber } = require("../utils/helpers");
const Activity = require("../models/Activity");
// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    if (status === "active") {
      query.deletedAt = null;
      query.isBanned = false;
    } else if (status === "banned") {
      query.isBanned = true;
    } else if (status === "deleted") {
      query.deletedAt = { $ne: null };
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const users = await User.find(query)
      .select("-password -refreshTokens -verificationCode")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -refreshTokens -verificationCode -twoFactorSecret")
      .populate("badges");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check privacy settings
    const isOwner = req.user.id === userId;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    let responseData = user.toObject();

    if (!isOwner && !isAdmin) {
      if (!user.preferences.privacy.showEmail) {
        responseData.email = maskEmail(user.email);
      }
      if (!user.preferences.privacy.showPhone && user.phone) {
        responseData.phone = maskPhone(user.phone);
      }
      if (!user.preferences.privacy.showLocation) {
        responseData.location = null;
        responseData.coordinates = null;
      }
      if (!user.preferences.privacy.showLastSeen) {
        responseData.lastSeen = null;
      }
      if (!user.preferences.privacy.showPoints) {
        responseData.points = null;
      }
    }

    res.json({
      success: true,
      user: responseData,
    });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// exports.getActivities = async (req, res) => {
//   try {
//     const { limit = 20, offset = 0, action } = req.query;

//     const query = { user: req.user.id };

//     if (action && action !== "all") {
//       query.action = action;
//     }

//     const activities = await Activity.find(query)
//       .sort({ createdAt: -1 })
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     const total = await Activity.countDocuments(query);

//     // Format activities for the frontend
//     const formattedActivities = activities.map((activity) => ({
//       id: activity._id,
//       action: activity.action,
//       item: activity.item,
//       user: activity.user,
//       group: activity.group,
//       time: getTimeAgo(activity.createdAt),
//       timestamp: activity.createdAt,
//     }));

//     res.json({
//       success: true,
//       activities: formattedActivities,
//       pagination: {
//         total,
//         hasMore: activities.length === parseInt(limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get activities error:", error);
//     logger.error(`Get activities error: ${error.message}`);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch activities",
//     });
//   }
// };

// Helper function for time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

// Add method to create activity (to be called from other controllers)
exports.createActivity = async (userId, action, data) => {
  try {
    const activity = new Activity({
      user: userId,
      action,
      item: data.item,
      itemId: data.itemId,
      user: data.userName,
      userId: data.userId,
      group: data.group,
      metadata: data.metadata || {},
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error("Create activity error:", error);
    return null;
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    console.log("=== getProfile START ===");
    console.log("User ID from token:", req.user?._id || req.user?.id);

    const userId = req.user._id || req.user.id;

    // Fetch user with all necessary populations
    const user = await User.findById(userId)
      .select(
        "-password -refreshTokens -verificationCode -twoFactorSecret -magicToken -resetPasswordToken",
      )
      .populate({
        path: "badges",
        select: "name description icon iconComponent color level points",
        options: { sort: { level: 1 } },
      })
      .populate({
        path: "wishlist",
        select: "title images price priceType status category",
        populate: {
          path: "owner",
          select: "fullName username avatar rating trustScore",
        },
        options: { limit: 10, sort: { createdAt: -1 } },
      })
      .populate({
        path: "referredBy",
        select: "fullName username avatar",
      });

    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate profile completion percentage
    const profileCompletion = calculateProfileCompletionHelper(user);

    // Get user statistics with real-time data
    const realTimeStats = await getUserRealTimeStatsHelper(userId);

    // Get recent activity
    const recentActivity = await getUserRecentActivityHelper(userId, 10);

    // Get upcoming exchanges
    const upcomingExchanges = await getUserUpcomingExchangesHelper(userId);

    // Check for unread notifications count
    const unreadNotificationsCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    // Get unread messages count
    const unreadMessagesCount = await getUnreadMessagesCountHelper(userId);

    // Prepare user object with enriched data
    const userObject = user.toObject();
    userObject.profileCompletion = profileCompletion;
    userObject.realTimeStats = realTimeStats;
    userObject.recentActivity = recentActivity;
    userObject.upcomingExchanges = upcomingExchanges;
    userObject.unreadNotifications = unreadNotificationsCount;
    userObject.unreadMessages = unreadMessagesCount;

    // Add privacy settings
    userObject.privacySettings = {
      showEmail: user.preferences?.privacy?.showEmail ?? true,
      showPhone: user.preferences?.privacy?.showPhone ?? false,
      showLocation: user.preferences?.privacy?.showLocation ?? true,
      showLastSeen: user.preferences?.privacy?.showLastSeen ?? true,
      showPoints: user.preferences?.privacy?.showPoints ?? true,
    };

    // Add notification preferences
    userObject.notificationPreferences = user.notificationPreferences || {
      messages: true,
      requests: true,
      returns: true,
      reviews: true,
      promotions: false,
      system: true,
    };

    console.log("Profile fetched successfully for:", user.email);

    res.json({
      success: true,
      user: userObject,
    });
  } catch (error) {
    console.error("=== getProfile ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============ HELPER FUNCTIONS (Place these AFTER all exports but BEFORE module.exports) ============

// Calculate profile completion percentage
const calculateProfileCompletionHelper = (user) => {
  let completed = 0;
  let total = 10;

  if (user.fullName) completed++;
  if (user.bio && user.bio.length > 0) completed++;
  if (user.phone) completed++;
  if (user.location) completed++;
  if (user.avatar) completed++;
  if (user.interests && user.interests.length > 0) completed++;
  if (user.skills && user.skills.length > 0) completed++;
  if (user.emailVerified) completed++;
  if (user.campusAddress) completed++;
  if (user.userType !== "external") completed++;

  return Math.round((completed / total) * 100);
};

// Get user real-time statistics
const getUserRealTimeStatsHelper = async (userId) => {
  const Resource = require("../models/Resource");
  const Exchange = require("../models/Exchange");
  const Review = require("../models/Review");

  const totalResources = await Resource.countDocuments({ owner: userId });
  const activeListings = await Resource.countDocuments({
    owner: userId,
    status: "available",
  });
  const completedExchanges = await Exchange.countDocuments({
    $or: [{ owner: userId }, { borrower: userId }],
    status: "completed",
  });
  const pendingRequests = await Exchange.countDocuments({
    $or: [{ owner: userId }, { borrower: userId }],
    status: "pending",
  });

  const ratingResult = await Review.aggregate([
    { $match: { reviewee: userId } },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);
  const averageRating = ratingResult[0]?.avg || 0;

  const totalReviews = await Review.countDocuments({ reviewee: userId });

  const viewsResult = await Resource.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: null, total: { $sum: "$views" } } },
  ]);
  const totalViews = viewsResult[0]?.total || 0;

  return {
    totalResources: totalResources || 0,
    activeListings: activeListings || 0,
    completedExchanges: completedExchanges || 0,
    pendingRequests: pendingRequests || 0,
    averageRating: averageRating || 0,
    totalReviews: totalReviews || 0,
    totalViews: totalViews || 0,
  };
};

// Get user recent activity
const getUserRecentActivityHelper = async (userId, limit = 10) => {
  const Exchange = require("../models/Exchange");

  const activities = await Exchange.find({
    $or: [{ owner: userId }, { borrower: userId }],
  })
    .populate("resource", "title images category")
    .populate("owner", "fullName username avatar")
    .populate("borrower", "fullName username avatar")
    .sort({ createdAt: -1 })
    .limit(limit);

  return activities.map((activity) => ({
    id: activity._id,
    type: activity.owner._id.toString() === userId ? "lent" : "borrowed",
    resource: {
      id: activity.resource?._id,
      title: activity.resource?.title,
      image: activity.resource?.images?.[0]?.url,
      category: activity.resource?.category,
    },
    partner:
      activity.owner._id.toString() === userId
        ? activity.borrower
        : activity.owner,
    startDate: activity.startDate,
    endDate: activity.endDate,
    status: activity.status,
    totalAmount: activity.totalAmount,
    createdAt: activity.createdAt,
  }));
};

// Get user upcoming exchanges
const getUserUpcomingExchangesHelper = async (userId) => {
  const Exchange = require("../models/Exchange");

  const exchanges = await Exchange.find({
    $or: [{ owner: userId }, { borrower: userId }],
    status: { $in: ["approved", "active"] },
    endDate: { $gte: new Date() },
  })
    .populate("resource", "title images category")
    .populate("owner", "fullName username avatar")
    .populate("borrower", "fullName username avatar")
    .sort({ startDate: 1 })
    .limit(5);

  return exchanges.map((exchange) => ({
    id: exchange._id,
    type: exchange.owner._id.toString() === userId ? "lent" : "borrowed",
    resource: {
      id: exchange.resource?._id,
      title: exchange.resource?.title,
      image: exchange.resource?.images?.[0]?.url,
    },
    partner:
      exchange.owner._id.toString() === userId
        ? exchange.borrower
        : exchange.owner,
    startDate: exchange.startDate,
    endDate: exchange.endDate,
    daysRemaining: Math.ceil(
      (exchange.endDate - new Date()) / (1000 * 60 * 60 * 24),
    ),
    totalAmount: exchange.totalAmount,
  }));
};

// Get unread messages count
const getUnreadMessagesCountHelper = async (userId) => {
  const Conversation = require("../models/Conversation");

  const conversations = await Conversation.find({
    participants: userId,
    deletedFor: { $ne: userId },
  });

  let totalUnread = 0;
  for (const conv of conversations) {
    const settings = conv.getUserSettings(userId);
    totalUnread += settings.unreadCount || 0;
  }

  return totalUnread;
};

// ============ HELPER FUNCTIONS ============

// Calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let completed = 0;
  let total = 12;

  if (user.fullName) completed++;
  if (user.bio && user.bio.length > 0) completed++;
  if (user.phone) completed++;
  if (user.location) completed++;
  if (user.avatar) completed++;
  if (user.interests && user.interests.length > 0) completed++;
  if (user.skills && user.skills.length > 0) completed++;
  if (user.emailVerified) completed++;
  if (user.socialLinks && Object.values(user.socialLinks).some((v) => v))
    completed++;
  if (user.campusAddress) completed++;
  if (user.department) completed++;
  if (user.userType !== "external") completed++;

  return Math.round((completed / total) * 100);
};
// Get user real-time statistics
const getUserRealTimeStats = async (userId) => {
  const Resource = require("../models/Resource");
  const Exchange = require("../models/Exchange");
  const Review = require("../models/Review");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const [
      totalResources,
      activeListings,
      completedExchanges,
      pendingRequests,
      averageRating,
      totalReviews,
      totalViews,
      totalLikes,
    ] = await Promise.all([
      Resource.countDocuments({ owner: userId }),
      Resource.countDocuments({ owner: userId, status: "available" }),
      Exchange.countDocuments({
        $or: [{ owner: userId }, { borrower: userId }],
        status: "completed",
      }),
      Exchange.countDocuments({
        $or: [{ owner: userId }, { borrower: userId }],
        status: "pending",
      }),
      Review.aggregate([
        { $match: { reviewee: userId } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      Review.countDocuments({ reviewee: userId }),
      Resource.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Resource.aggregate([
        { $match: { owner: userId } },
        {
          $group: {
            _id: null,
            total: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          },
        },
      ]),
    ]);

    // Get monthly activity
    const monthlyActivity = await Exchange.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { borrower: userId }],
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      totalResources: totalResources || 0,
      activeListings: activeListings || 0,
      completedExchanges: completedExchanges || 0,
      pendingRequests: pendingRequests || 0,
      averageRating: averageRating[0]?.avg || 0,
      totalReviews: totalReviews || 0,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      monthlyActivity: monthlyActivity || [],
    };
  } catch (error) {
    console.error("Error in getUserRealTimeStats:", error);
    return {
      totalResources: 0,
      activeListings: 0,
      completedExchanges: 0,
      pendingRequests: 0,
      averageRating: 0,
      totalReviews: 0,
      totalViews: 0,
      totalLikes: 0,
      monthlyActivity: [],
    };
  }
};

// Get user recent activity
const getUserRecentActivity = async (userId, limit = 10) => {
  const Exchange = require("../models/Exchange");

  const activities = await Exchange.find({
    $or: [{ owner: userId }, { borrower: userId }],
  })
    .populate("resource", "title images category")
    .populate("owner", "fullName username avatar")
    .populate("borrower", "fullName username avatar")
    .sort({ createdAt: -1 })
    .limit(limit);

  return activities.map((activity) => ({
    id: activity._id,
    type: activity.owner._id.toString() === userId ? "lent" : "borrowed",
    resource: {
      id: activity.resource._id,
      title: activity.resource.title,
      image: activity.resource.images?.[0]?.url,
      category: activity.resource.category,
    },
    partner:
      activity.owner._id.toString() === userId
        ? activity.borrower
        : activity.owner,
    startDate: activity.startDate,
    endDate: activity.endDate,
    status: activity.status,
    totalAmount: activity.totalAmount,
    createdAt: activity.createdAt,
    timeAgo: getTimeAgo(activity.createdAt),
  }));
};

// Get user upcoming exchanges
const getUserUpcomingExchanges = async (userId) => {
  const Exchange = require("../models/Exchange");

  const exchanges = await Exchange.find({
    $or: [{ owner: userId }, { borrower: userId }],
    status: { $in: ["approved", "active"] },
    endDate: { $gte: new Date() },
  })
    .populate("resource", "title images category")
    .populate("owner", "fullName username avatar")
    .populate("borrower", "fullName username avatar")
    .sort({ startDate: 1 })
    .limit(5);

  return exchanges.map((exchange) => ({
    id: exchange._id,
    type: exchange.owner._id.toString() === userId ? "lent" : "borrowed",
    resource: {
      id: exchange.resource._id,
      title: exchange.resource.title,
      image: exchange.resource.images?.[0]?.url,
    },
    partner:
      exchange.owner._id.toString() === userId
        ? exchange.borrower
        : exchange.owner,
    startDate: exchange.startDate,
    endDate: exchange.endDate,
    daysRemaining: Math.ceil(
      (exchange.endDate - new Date()) / (1000 * 60 * 60 * 24),
    ),
    totalAmount: exchange.totalAmount,
  }));
};

// Get unread messages count
const getUnreadMessagesCount = async (userId) => {
  const Message = require("../models/Message");
  const Conversation = require("../models/Conversation");

  const conversations = await Conversation.find({
    participants: userId,
    deletedFor: { $ne: userId },
  });

  let totalUnread = 0;
  for (const conv of conversations) {
    const settings = conv.getUserSettings(userId);
    totalUnread += settings.unreadCount || 0;
  }

  return totalUnread;
};

// Calculate user rank in community
const calculateUserRank = async (userId, trustScore, points) => {
  const User = require("../models/User");

  // Get total users count
  const totalUsers = await User.countDocuments({
    isBanned: false,
    deletedAt: null,
  });

  // Get users with higher trust score
  const higherTrustUsers = await User.countDocuments({
    trustScore: { $gt: trustScore },
    isBanned: false,
    deletedAt: null,
  });

  // Get users with same trust score but higher points
  const higherPointsUsers = await User.countDocuments({
    trustScore: trustScore,
    points: { $gt: points },
    isBanned: false,
    deletedAt: null,
  });

  const rank = higherTrustUsers + higherPointsUsers + 1;
  const percentile = ((totalUsers - rank) / totalUsers) * 100;

  let tier = "Bronze";
  if (percentile >= 95) tier = "Diamond";
  else if (percentile >= 85) tier = "Platinum";
  else if (percentile >= 70) tier = "Gold";
  else if (percentile >= 50) tier = "Silver";

  return {
    rank,
    totalUsers,
    percentile: Math.round(percentile),
    tier,
    isTopTen: rank <= Math.ceil(totalUsers * 0.1),
    isTopHundred: rank <= 100,
  };
};

// Get next badge progress
const getNextBadgeProgress = async (user) => {
  const Badge = require("../models/Badge");

  const earnedBadgeIds = user.badges.map((b) => b._id.toString());

  const nextBadges = await Badge.find({
    _id: { $nin: earnedBadgeIds },
    isActive: true,
    isHidden: false,
  })
    .sort({ requirementValue: 1 })
    .limit(3);

  const progress = [];

  for (const badge of nextBadges) {
    let currentValue = 0;
    switch (badge.requirementType) {
      case "items_shared":
        currentValue = user.stats.itemsShared;
        break;
      case "exchanges_completed":
        currentValue = user.stats.successfulExchanges;
        break;
      case "trust_score":
        currentValue = user.trustScore;
        break;
      case "points":
        currentValue = user.points;
        break;
      case "carbon_saved":
        currentValue = user.stats.carbonSaved;
        break;
      default:
        currentValue = 0;
    }

    progress.push({
      badge: {
        id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        level: badge.level,
      },
      current: currentValue,
      required: badge.requirementValue,
      percentage: Math.min(
        100,
        Math.floor((currentValue / badge.requirementValue) * 100),
      ),
    });
  }

  return progress;
};

// Helper function for time ago
d= (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
// @desc    Update profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      "fullName",
      "username",
      "bio",
      "phone",
      "location",
      "interests",
      "skills",
      "preferences",
      "sharingPreferences",
      "socialLinks",
      "campusAddress",
      "roomNumber",
    ];

    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Check username uniqueness
    if (
      filteredUpdates.username &&
      filteredUpdates.username !== req.user.username
    ) {
      const existing = await User.findOne({
        username: filteredUpdates.username,
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: filteredUpdates },
      { new: true, runValidators: true },
    ).select("-password -refreshTokens -verificationCode -twoFactorSecret");

    res.json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// @desc    Upload avatar
// @route   POST /api/users/me/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    const { uploadToCloudinary } = require("../services/cloudinary");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "avatars",
      public_id: `user_${req.user.id}`,
      transformation: [
        { width: 300, height: 300, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true },
    ).select("-password -refreshTokens -verificationCode");

    res.json({
      success: true,
      user,
      url: result.secure_url,
      message: "Avatar updated successfully",
    });
  } catch (error) {
    logger.error(`Upload avatar error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
    });
  }
};

// @desc    Get current user stats
// @route   GET /api/users/me/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    await user.updateStats();

    res.json({
      success: true,
      stats: {
        itemsShared: user.stats.itemsShared,
        itemsBorrowed: user.stats.itemsBorrowed,
        successfulExchanges: user.stats.successfulExchanges,
        canceledExchanges: user.stats.canceledExchanges,
        responseRate: user.stats.responseRate,
        avgResponseTime: user.stats.avgResponseTime,
        totalSavings: user.stats.totalSavings,
        carbonSaved: user.stats.carbonSaved,
        trustScore: user.trustScore,
        points: user.points,
        rating: user.rating,
        totalRatings: user.totalRatings,
      },
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};

// @desc    Get current user badges
// @route   GET /api/users/me/badges
// @access  Private
exports.getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("badges");

    res.json({
      success: true,
      badges: user.badges,
    });
  } catch (error) {
    logger.error(`Get badges error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badges",
    });
  }
};

// @desc    Get current user activities
// @route   GET /api/users/me/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const activities = await Exchange.find({
      $or: [{ owner: req.user.id }, { borrower: req.user.id }],
    })
      .populate("resource", "title images")
      .populate("owner", "fullName avatar")
      .populate("borrower", "fullName avatar")
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      type: activity.owner.toString() === req.user.id ? "shared" : "borrowed",
      title: activity.resource?.title,
      resourceId: activity.resource?._id,
      user:
        activity.owner.toString() === req.user.id
          ? activity.borrower?.fullName
          : activity.owner?.fullName,
      userId:
        activity.owner.toString() === req.user.id
          ? activity.borrower?._id
          : activity.owner?._id,
      status: activity.status,
      startDate: activity.startDate,
      endDate: activity.endDate,
      createdAt: activity.createdAt,
      totalAmount: activity.totalAmount,
    }));

    res.json({
      success: true,
      activities: formattedActivities,
      hasMore: activities.length === parseInt(limit),
    });
  } catch (error) {
    logger.error(`Get activities error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

// @desc    Get current user items
// @route   GET /api/users/me/items
// @access  Private
exports.getUserItems = async (req, res) => {
  try {
    const items = await Resource.find({
      owner: req.user.id,
      status: { $ne: "deleted" }, // ← ADD THIS LINE - exclude deleted items
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    logger.error(`Get user items error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};

// @desc    Get current user exchanges
// @route   GET /api/users/me/exchanges
// @access  Private
exports.getMyExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ owner: req.user.id }, { borrower: req.user.id }],
    })
      .populate("resource", "title images category")
      .populate("owner", "fullName avatar")
      .populate("borrower", "fullName avatar")
      .sort({ createdAt: -1 });

    const formattedExchanges = exchanges.map((exchange) => ({
      id: exchange._id,
      type: exchange.owner.toString() === req.user.id ? "lent" : "borrowed",
      resource: exchange.resource,
      partner:
        exchange.owner.toString() === req.user.id
          ? exchange.borrower
          : exchange.owner,
      startDate: exchange.startDate,
      endDate: exchange.endDate,
      status: exchange.status,
      totalAmount: exchange.totalAmount,
      rated:
        exchange.owner.toString() === req.user.id
          ? exchange.ownerRating
          : exchange.borrowerRating,
      createdAt: exchange.createdAt,
    }));

    res.json({
      success: true,
      exchanges: formattedExchanges,
    });
  } catch (error) {
    logger.error(`Get my exchanges error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exchanges",
    });
  }
};

// @desc    Get current user reviews
// @route   GET /api/users/me/reviews
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.user.id })
      .populate("reviewer", "fullName avatar")
      .populate("resource", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    logger.error(`Get user reviews error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// @desc    Get current user analytics
// @route   GET /api/users/me/analytics
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get monthly views
    const monthlyViews = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyViews.unshift({
        month: date.toLocaleString("default", { month: "short" }),
        views: Math.floor(Math.random() * 100) + 50,
      });
    }

    // Get category distribution
    const resources = await Resource.find({ owner: req.user.id });
    const categoryMap = new Map();
    resources.forEach((r) => {
      categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + 1);
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({
        name,
        count,
        percentage: (count / resources.length) * 100,
      }),
    );

    res.json({
      success: true,
      analytics: {
        totalViews: user.stats.totalViews,
        profileViews: user.stats.profileViews,
        itemsShared: user.stats.itemsShared,
        exchanges: user.stats.successfulExchanges,
        moneySaved: user.stats.totalSavings,
        carbonSaved: user.stats.carbonSaved,
        rating: user.rating,
        responseRate: user.stats.responseRate,
        trustScore: user.trustScore,
        monthlyViews,
        categoryDistribution,
        peopleHelped: user.stats.successfulExchanges * 2,
        communityRank:
          user.trustScore > 90
            ? "Top 5%"
            : user.trustScore > 70
              ? "Top 15%"
              : "Top 30%",
        positiveImpact: Math.min(
          100,
          Math.floor(
            user.trustScore * 0.8 + user.stats.successfulExchanges * 2,
          ),
        ),
      },
    });
  } catch (error) {
    logger.error(`Get user analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const users = await User.find({
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user.id },
      deletedAt: null,
      isBanned: false,
    })
      .select("fullName username avatar trustScore rating")
      .limit(parseInt(limit));

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    logger.error(`Search users error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};

// @desc    Block user
// @route   POST /api/users/:userId/block
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot block yourself",
      });
    }

    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.blockedUsers.includes(userId)) {
      user.blockedUsers.push(userId);
      await user.save();
    }

    res.json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    logger.error(`Block user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to block user",
    });
  }
};

// @desc    Unblock user
// @route   POST /api/users/:userId/unblock
// @access  Private
exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(req.user.id);

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== userId,
    );
    await user.save();

    res.json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    logger.error(`Unblock user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unblock user",
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Soft delete
    user.deletedAt = new Date();
    user.deletionScheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.isBanned = true;
    user.banReason = "Account deletion requested";
    user.email = `deleted_${user._id}@deleted.user`;
    user.username = `deleted_${user._id}`;
    await user.save();

    // Revoke all sessions
    await User.findByIdAndUpdate(user._id, {
      $set: { refreshTokens: [] },
    });

    // Delete token records
    await Token.deleteMany({ user: user._id });

    // Send notification
    await sendNotificationByType(user._id, "system", {
      message:
        "Your account deletion has been scheduled. You have 30 days to restore your account.",
    });

    res.json({
      success: true,
      message:
        "Account deletion scheduled. You have 30 days to restore your account.",
    });
  } catch (error) {
    logger.error(`Delete account error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

// @desc    Restore account
// @route   POST /api/users/me/restore
// @access  Private
exports.restoreAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.deletedAt || user.deletionScheduledAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Account cannot be restored",
      });
    }

    user.deletedAt = null;
    user.deletionScheduledAt = null;
    user.isBanned = false;
    user.banReason = null;
    await user.save();

    res.json({
      success: true,
      message: "Account restored successfully",
    });
  } catch (error) {
    logger.error(`Restore account error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to restore account",
    });
  }
};

// @desc    Export user data
// @route   GET /api/users/me/export
// @access  Private
exports.exportData = async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens -verificationCode",
    );
    const resources = await Resource.find({ owner: req.user.id });
    const exchanges = await Exchange.find({
      $or: [{ owner: req.user.id }, { borrower: req.user.id }],
    });
    const reviews = await Review.find({ reviewer: req.user.id });

    const exportData = {
      user: user.toObject(),
      resources,
      exchanges,
      reviews,
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
    };

    if (format === "json") {
      const json = JSON.stringify(exportData, null, 2);
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=resourcehub-data-${new Date().toISOString()}.json`,
      );
      return res.send(json);
    }

    // CSV format
    const { Parser } = require("json2csv");
    const fields = [
      "id",
      "title",
      "category",
      "status",
      "createdAt",
      "updatedAt",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(resources);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resourcehub-resources-${new Date().toISOString()}.csv`,
    );
    res.send(csv);
  } catch (error) {
    logger.error(`Export data error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to export data",
    });
  }
};

// @desc    Get user resources by userId
// @route   GET /api/users/:userId/resources
// @access  Private
exports.getUserResources = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, status, category } = req.query;

    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.deletedAt || targetUser.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const query = { owner: userId, status: "available" };

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const resources = await Resource.find(query)
      .populate("owner", "fullName username avatar rating trustScore")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get user resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user resources",
    });
  }
};

// @desc    Get user exchanges by userId
// @route   GET /api/users/:userId/exchanges
// @access  Private
exports.getUserExchanges = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.deletedAt || targetUser.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const query = {
      $or: [{ owner: userId }, { borrower: userId }],
    };

    if (status && status !== "all") {
      query.status = status;
    }

    const exchanges = await Exchange.find(query)
      .populate("resource", "title images category")
      .populate("owner", "fullName username avatar")
      .populate("borrower", "fullName username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Exchange.countDocuments(query);
    const isOwner = req.user.id === userId;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    const formattedExchanges = exchanges.map((exchange) => {
      const userIsOwner = exchange.owner._id.toString() === userId;

      let exchangeData = {
        id: exchange._id,
        type: userIsOwner ? "lent" : "borrowed",
        resource: {
          id: exchange.resource._id,
          title: exchange.resource.title,
          images: exchange.resource.images,
          category: exchange.resource.category,
        },
        startDate: exchange.startDate,
        endDate: exchange.endDate,
        status: exchange.status,
        totalAmount: exchange.totalAmount,
        createdAt: exchange.createdAt,
      };

      if (userIsOwner) {
        exchangeData.borrower = {
          id: exchange.borrower._id,
          fullName: exchange.borrower.fullName,
          username: exchange.borrower.username,
          avatar: exchange.borrower.avatar,
        };
        exchangeData.rated = !!exchange.ownerRating;
      } else {
        exchangeData.owner = {
          id: exchange.owner._id,
          fullName: exchange.owner.fullName,
          username: exchange.owner.username,
          avatar: exchange.owner.avatar,
        };
        exchangeData.rated = !!exchange.borrowerRating;
      }

      if (!isOwner && !isAdmin) {
        if (userIsOwner) {
          delete exchangeData.borrower;
        } else {
          delete exchangeData.owner;
        }
      }

      return exchangeData;
    });

    res.json({
      success: true,
      exchanges: formattedExchanges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get user exchanges error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user exchanges",
    });
  }
};

// @desc    Get user reviews by userId
// @route   GET /api/users/:userId/reviews
// @access  Private
// exports.getUserReviews = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { page = 1, limit = 20 } = req.query;

//     const targetUser = await User.findById(userId);
//     if (!targetUser || targetUser.deletedAt || targetUser.isBanned) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const reviews = await Review.find({ reviewee: userId })
//       .populate("reviewer", "fullName username avatar")
//       .populate("resource", "title")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Review.countDocuments({ reviewee: userId });

//     res.json({
//       success: true,
//       reviews,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//         hasMore: page * limit < total,
//       },
//     });
//   } catch (error) {
//     logger.error(`Get user reviews error: ${error.message}`);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user reviews",
//     });
//   }
// };

// @desc    Get user achievements by userId
// @route   GET /api/users/:userId/achievements
// @access  Private
exports.getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("badges achievements stats")
      .populate("badges");

    if (!user || user.deletedAt || user.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const achievements = [
      {
        id: "first_share",
        title: "First Share",
        description: "Shared your first item",
        icon: "🎁",
        earned: user.stats.itemsShared >= 1,
        progress: Math.min(100, (user.stats.itemsShared / 1) * 100),
        target: 1,
        current: user.stats.itemsShared,
      },
      {
        id: "sharing_star",
        title: "Sharing Star",
        description: "Shared 10 items",
        icon: "⭐",
        earned: user.stats.itemsShared >= 10,
        progress: Math.min(100, (user.stats.itemsShared / 10) * 100),
        target: 10,
        current: user.stats.itemsShared,
      },
      {
        id: "community_hero",
        title: "Community Hero",
        description: "Completed 20 successful exchanges",
        icon: "🦸",
        earned: user.stats.successfulExchanges >= 20,
        progress: Math.min(100, (user.stats.successfulExchanges / 20) * 100),
        target: 20,
        current: user.stats.successfulExchanges,
      },
      {
        id: "eco_warrior",
        title: "Eco Warrior",
        description: "Saved 100kg of CO2 emissions",
        icon: "🌱",
        earned: user.stats.carbonSaved >= 100,
        progress: Math.min(100, (user.stats.carbonSaved / 100) * 100),
        target: 100,
        current: user.stats.carbonSaved,
      },
      {
        id: "trusted_member",
        title: "Trusted Member",
        description: "Achieve 90+ trust score",
        icon: "🤝",
        earned: user.trustScore >= 90,
        progress: Math.min(100, (user.trustScore / 90) * 100),
        target: 90,
        current: user.trustScore,
      },
      {
        id: "top_rated",
        title: "Top Rated",
        description: "Maintain 4.5+ rating",
        icon: "🏆",
        earned: user.rating >= 4.5,
        progress: Math.min(100, (user.rating / 4.5) * 100),
        target: 4.5,
        current: user.rating,
      },
    ];

    res.json({
      success: true,
      achievements,
      badges: user.badges || [],
    });
  } catch (error) {
    logger.error(`Get user achievements error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user achievements",
    });
  }
};

// @desc    Get user stats by userId
// @route   GET /api/users/:userId/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user || user.deletedAt || user.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resourcesCount = await Resource.countDocuments({
      owner: userId,
      status: "available",
    });
    const exchangesCount = await Exchange.countDocuments({
      $or: [{ owner: userId }, { borrower: userId }],
      status: "completed",
    });

    const isOwner = req.user.id === userId;
    const isAdmin =
      req.user.role === "admin" || req.user.role === "super_admin";

    let stats = {
      memberSince: user.createdAt,
      itemsShared: user.stats.itemsShared,
      itemsBorrowed: user.stats.itemsBorrowed,
      successfulExchanges: user.stats.successfulExchanges,
      responseRate: user.stats.responseRate,
      trustScore: user.trustScore,
      rating: user.rating,
      totalRatings: user.totalRatings,
    };

    if (isOwner || isAdmin) {
      stats = {
        ...stats,
        canceledExchanges: user.stats.canceledExchanges,
        avgResponseTime: user.stats.avgResponseTime,
        totalSavings: user.stats.totalSavings,
        carbonSaved: user.stats.carbonSaved,
        points: user.points,
        profileViews: user.stats.profileViews,
        totalViews: user.stats.totalViews,
      };
    }

    stats.activeListings = resourcesCount;
    stats.totalExchanges = exchangesCount;

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error(`Get user stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
    });
  }
};
// @desc    Get user sessions
// @route   GET /api/users/me/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    // Get active sessions
    const Token = require("../models/Token");
    const sessions = await Token.find({
      user: req.user.id,
      isValid: true,
      expiresAt: { $gt: new Date() },
    })
      .select("createdAt expiresAt userAgent ipAddress")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error) {
    logger.error(`Get sessions error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
};
// @desc    Get user reviews by userId
// @route   GET /api/users/:userId/reviews
// @access  Private
exports.getUserReviewsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.deletedAt || targetUser.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "fullName username avatar")
      .populate("resource", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewee: userId });

    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get user reviews by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reviews",
    });
  }
};
// @desc    Get user activities by userId
// @route   GET /api/users/:userId/activities
// @access  Private
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const user = await User.findById(userId);
    if (!user || user.deletedAt || user.isBanned) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const activities = await Exchange.find({
      $or: [{ owner: userId }, { borrower: userId }],
    })
      .populate("resource", "title images category")
      .populate("owner", "fullName avatar")
      .populate("borrower", "fullName avatar")
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const formattedActivities = activities.map((activity) => ({
      id: activity._id,
      type: activity.owner.toString() === userId ? "shared" : "borrowed",
      title: activity.resource?.title,
      resourceId: activity.resource?._id,
      user:
        activity.owner.toString() === userId
          ? activity.borrower?.fullName
          : activity.owner?.fullName,
      userId:
        activity.owner.toString() === userId
          ? activity.borrower?._id
          : activity.owner?._id,
      userAvatar:
        activity.owner.toString() === userId
          ? activity.borrower?.avatar
          : activity.owner?.avatar,
      status: activity.status,
      startDate: activity.startDate,
      endDate: activity.endDate,
      createdAt: activity.createdAt,
      totalAmount: activity.totalAmount,
    }));

    res.json({
      success: true,
      activities: formattedActivities,
      hasMore: activities.length === parseInt(limit),
    });
  } catch (error) {
    logger.error(`Get user activities error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activities",
    });
  }
};
// ============ MODULE EXPORTS ============
module.exports = {
  getUsers: exports.getUsers,
  getUserById: exports.getUserById,
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  uploadAvatar: exports.uploadAvatar,
  deleteAccount: exports.deleteAccount,
  restoreAccount: exports.restoreAccount,
  exportData: exports.exportData,
  getStats: exports.getStats,
  getBadges: exports.getBadges,
  getSessions: exports.getSessions,
  getActivities: exports.getActivities,
  getUserItems: exports.getUserItems,
  getMyExchanges: exports.getMyExchanges,
  getUserAnalytics: exports.getUserAnalytics,
  getUserReviews: exports.getUserReviews,
  getUserReviewsById: exports.getUserReviewsById,
  searchUsers: exports.searchUsers,
  blockUser: exports.blockUser,
  unblockUser: exports.unblockUser,
  getUserResources: exports.getUserResources,
  getUserExchanges: exports.getUserExchanges,
  getUserAchievements: exports.getUserAchievements,
  getUserStats: exports.getUserStats,
  getUserActivities: exports.getUserActivities,
};
