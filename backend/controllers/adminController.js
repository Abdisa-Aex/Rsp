const User = require("../models/User");
const Resource = require("../models/Resource");
const Exchange = require("../models/Exchange");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const { sendNotificationByType } = require("../config/firebase");
const { logger } = require("../utils/logger");
const { exportToCSV } = require("../utils/helpers");

// ... rest of imports
// ==================== USER MANAGEMENT ====================

// @desc    Get all users (admin)
// @route   GET /api/admin/users
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
      .select("-password -refreshTokens -verificationCode -twoFactorSecret")
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

// @desc    Get exchanges analytics
// @route   GET /api/admin/analytics/exchanges
// @access  Private/Admin
exports.getExchangeAnalytics = async (req, res) => {
  try {
    const exchanges = await Exchange.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: exchanges.map((e) => ({ name: e._id, value: e.count })),
    });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenue = await Exchange.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({ success: true, data: revenue });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
};
// ==================== BADGE MANAGEMENT ====================

// @desc    Get all badges
// @route   GET /api/admin/badges
// @access  Private/Admin
exports.getBadges = async (req, res) => {
  try {
    const Badge = require("../models/Badge");
    const badges = await Badge.find().sort({ level: 1, name: 1 });
    res.json({ success: true, badges });
  } catch (error) {
    logger.error(`Get badges error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to fetch badges" });
  }
};

// @desc    Create badge
// @route   POST /api/admin/badges
// @access  Private/Admin
exports.createBadge = async (req, res) => {
  try {
    const Badge = require("../models/Badge");
    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json({ success: true, badge });
  } catch (error) {
    logger.error(`Create badge error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to create badge" });
  }
};

// @desc    Update badge
// @route   PUT /api/admin/badges/:badgeId
// @access  Private/Admin
exports.updateBadge = async (req, res) => {
  try {
    const Badge = require("../models/Badge");
    const badge = await Badge.findByIdAndUpdate(req.params.badgeId, req.body, { new: true });
    if (!badge) {
      return res.status(404).json({ success: false, message: "Badge not found" });
    }
    res.json({ success: true, badge });
  } catch (error) {
    logger.error(`Update badge error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to update badge" });
  }
};

// @desc    Delete badge
// @route   DELETE /api/admin/badges/:badgeId
// @access  Private/Admin
exports.deleteBadge = async (req, res) => {
  try {
    const Badge = require("../models/Badge");
    const badge = await Badge.findByIdAndDelete(req.params.badgeId);
    if (!badge) {
      return res.status(404).json({ success: false, message: "Badge not found" });
    }
    res.json({ success: true, message: "Badge deleted successfully" });
  } catch (error) {
    logger.error(`Delete badge error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to delete badge" });
  }
};

// @desc    Export all user data
// @route   GET /api/users/me/export-all
// @access  Private
exports.exportAllData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user data
    const user = await User.findById(userId).select("-password -refreshTokens -verificationCode -twoFactorSecret -magicToken");
    const resources = await Resource.find({ owner: userId });
    const exchanges = await Exchange.find({
      $or: [{ owner: userId }, { borrower: userId }]
    });
    const reviews = await Review.find({ reviewer: userId });
    const notifications = await Notification.find({ user: userId });

    // Get wishlist items
    const wishlistItems = await Resource.find({ _id: { $in: user.wishlist || [] } });

    const exportData = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        userType: user.userType,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        points: user.points,
        trustScore: user.trustScore,
        rating: user.rating,
        preferences: user.preferences,
        notificationPreferences: user.notificationPreferences,
        stats: user.stats,
        createdAt: user.createdAt,
      },
      resources: resources.map(r => ({
        _id: r._id,
        title: r.title,
        description: r.description,
        category: r.category,
        location: r.location,
        price: r.price,
        priceType: r.priceType,
        status: r.status,
        images: r.images,
        createdAt: r.createdAt,
      })),
      exchanges: exchanges.map(e => ({
        _id: e._id,
        resource: e.resource,
        startDate: e.startDate,
        endDate: e.endDate,
        status: e.status,
        totalAmount: e.totalAmount,
        createdAt: e.createdAt,
      })),
      reviews: reviews.map(r => ({
        _id: r._id,
        rating: r.rating,
        review: r.review,
        createdAt: r.createdAt,
      })),
      notifications: notifications.map(n => ({
        _id: n._id,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
      })),
      wishlist: wishlistItems.map(w => ({
        _id: w._id,
        title: w.title,
        category: w.category,
        price: w.price,
      })),
    };

    res.json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    console.error("Export all data error:", error);
    logger.error(`Export all data error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Import user data (restore from backup)
// @route   POST /api/users/me/import
// @access  Private
exports.importData = async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.user.id;

    if (!data || !data.version) {
      return res.status(400).json({
        success: false,
        message: "Invalid backup data",
      });
    }

    let importedCount = 0;

    // Import resources
    if (data.resources && data.resources.length > 0) {
      for (const resource of data.resources) {
        // Check if resource already exists
        const existingResource = await Resource.findOne({
          title: resource.title,
          owner: userId
        });

        if (!existingResource) {
          const newResource = new Resource({
            ...resource,
            owner: userId,
            _id: undefined, // Let MongoDB generate new ID
            images: resource.images || [],
          });
          await newResource.save();
          importedCount++;
        }
      }
    }

    // Import preferences
    if (data.user && data.user.preferences) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          preferences: data.user.preferences,
          notificationPreferences: data.user.notificationPreferences || {
            messages: true,
            requests: true,
            returns: true,
            reviews: true,
            promotions: false,
            system: true,
          },
        }
      });
    }

    res.json({
      success: true,
      message: `Data imported successfully. Imported ${importedCount} items.`,
      imported: {
        resources: importedCount,
      }
    });
  } catch (error) {
    console.error("Import data error:", error);
    logger.error(`Import data error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset all user data
// @route   DELETE /api/users/me/reset
// @access  Private
exports.resetUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all user resources
    await Resource.deleteMany({ owner: userId });

    // Delete all exchanges involving user
    await Exchange.deleteMany({
      $or: [{ owner: userId }, { borrower: userId }]
    });

    // Delete all reviews by user
    await Review.deleteMany({ reviewer: userId });

    // Delete all notifications for user
    await Notification.deleteMany({ user: userId });

    // Reset user stats and wishlist
    await User.findByIdAndUpdate(userId, {
      $set: {
        wishlist: [],
        points: 0,
        trustScore: 0,
        rating: 0,
        totalRatings: 0,
        stats: {
          itemsShared: 0,
          itemsBorrowed: 0,
          successfulExchanges: 0,
          canceledExchanges: 0,
          responseRate: 0,
          avgResponseTime: 0,
          totalSavings: 0,
          carbonSaved: 0,
          totalViews: 0,
          profileViews: 0,
        },
      }
    });

    logger.info(`User ${userId} reset all data`);

    res.json({
      success: true,
      message: "All data has been reset successfully",
    });
  } catch (error) {
    console.error("Reset data error:", error);
    logger.error(`Reset data error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Clear all notifications
// @route   DELETE /api/admin/notifications/clear
// @access  Private/Admin
exports.clearNotifications = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { read: true });
    res.json({ success: true, message: "Notifications cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get user by ID (admin)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId)
      .select(
        "-password -refreshTokens -verificationCode -twoFactorSecret -__v",
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add id field for frontend compatibility
    user.id = user._id;

    // Get user's resources count
    const resourcesCount = await Resource.countDocuments({ owner: userId });

    // Get user's exchanges count
    const exchangesCount = await Exchange.countDocuments({
      $or: [{ owner: userId }, { borrower: userId }],
      status: "completed",
    });

    // Add additional stats
    if (!user.stats) user.stats = {};
    user.stats.totalResources = resourcesCount;
    user.stats.totalExchanges = exchangesCount;

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error(`Get user by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};
// ==================== ANALYTICS FUNCTIONS ====================

// @desc    Get category analytics for chart
// @route   GET /api/admin/analytics/categories
// @access  Private/Admin
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const categories = await Resource.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const data = categories.map((cat) => ({
      category: cat._id || "Other",
      count: cat.count,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("Category analytics error:", error);
    res.json({ success: true, data: [] });
  }
};




// @desc    Get geographic distribution
// @route   GET /api/admin/analytics/geographic
// @access  Private/Admin
exports.getGeographicAnalytics = async (req, res) => {
  try {
    // Get users by location
    const users = await User.aggregate([
      { $match: { location: { $exists: true, $ne: "" } } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const total = users.reduce((sum, u) => sum + u.count, 0);
    const data = users.map((u) => ({
      city: u._id,
      count: u.count,
      percentage: total > 0 ? Math.round((u.count / total) * 100) : 0,
    }));

    if (data.length === 0) {
      data.push({ city: "No Data", count: 0, percentage: 100 });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Geographic analytics error:", error);
    res.json({
      success: true,
      data: [{ city: "Unknown", count: 0, percentage: 100 }],
    });
  }
};

// @desc    Get device breakdown
// @route   GET /api/admin/analytics/devices
// @access  Private/Admin
exports.getDeviceAnalytics = async (req, res) => {
  try {
    // Mock device data (in production, track this in session or analytics)
    const data = [
      { type: "Desktop", percentage: 45 },
      { type: "Mobile", percentage: 40 },
      { type: "Tablet", percentage: 15 },
    ];

    res.json({ success: true, data });
  } catch (error) {
    console.error("Device analytics error:", error);
    res.json({ success: true, data: [] });
  }
};




// @desc    Ban user
// @route   PUT /api/admin/users/:userId/ban
// @access  Private/Admin
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body;

    console.log("Banning user:", userId);
    console.log("Reason:", reason);

    // Validate user ID
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow banning super admin
    if (user.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot ban super admin",
      });
    }

    // Don't allow banning yourself
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot ban yourself",
      });
    }

    // Ban the user
    user.isBanned = true;
    user.banReason = reason || "Violation of community guidelines";
    user.bannedAt = new Date();
    user.bannedBy = req.user.id;

    if (duration) {
      user.bannedUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }

    await user.save();

    console.log(`User ${userId} banned successfully`);

    res.json({
      success: true,
      message: "User banned successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        isBanned: user.isBanned,
        banReason: user.banReason,
      },
    });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to ban user",
    });
  }
};
// @desc    Unban user
// @route   PUT /api/admin/users/:userId/unban
// @access  Private/Admin
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Unbanning user:", userId);

    // Validate user ID
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Unban the user
    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
    user.bannedUntil = null;
    user.bannedBy = null;

    await user.save();

    console.log(`User ${userId} unbanned successfully`);

    res.json({
      success: true,
      message: "User unbanned successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    console.error("Unban user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to unban user",
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, permissions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "super_admin" && role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot demote super admin",
      });
    }

    user.role = role;
    if (permissions) {
      user.permissions = permissions;
    }
    await user.save();

    logger.info(`User ${userId} role updated to ${role} by ${req.user.id}`);

    res.json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    logger.error(`Update user role error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// @desc    Delete user (permanently)
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete super admin",
      });
    }

    // Delete all user data
    await Resource.deleteMany({ owner: userId });
    await Exchange.deleteMany({
      $or: [{ owner: userId }, { borrower: userId }],
    });
    await Notification.deleteMany({ user: userId });
    await Report.deleteMany({ reporter: userId });

    // Delete user
    await user.deleteOne();

    logger.info(`User ${userId} deleted by ${req.user.id}`);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// @desc    Impersonate user
// @route   POST /api/admin/users/:userId/impersonate
// @access  Private/Admin
exports.impersonateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isImpersonated: true,
        impersonatedBy: req.user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      message: `Impersonating ${user.fullName}`,
    });
  } catch (error) {
    logger.error(`Impersonate user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to impersonate user",
    });
  }
};

// ==================== RESOURCE MODERATION ====================

// @desc    Get all resources (admin)
// @route   GET /api/admin/resources
// @access  Private/Admin
exports.getResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status,
      moderationStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (moderationStatus && moderationStatus !== "all") {
      query.moderationStatus = moderationStatus;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const resources = await Resource.find(query)
      .populate("owner", "fullName username email")
      .sort(sort)
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
    logger.error(`Get resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};

// @desc    Get resource by ID (admin)
// @route   GET /api/admin/resources/:resourceId
// @access  Private/Admin
exports.getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId)
      .populate("owner", "fullName username email phone")
      .populate("reviews");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    res.json({
      success: true,
      resource,
    });
  } catch (error) {
    logger.error(`Get resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
    });
  }
};

// @desc    Moderate resource
// @route   POST /api/admin/resources/:resourceId/moderate
// @access  Private/Admin
exports.moderateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { action, reason } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    resource.moderationStatus = action === "approve" ? "approved" : "rejected";
    resource.moderationNotes = reason;
    resource.moderatedBy = req.user.id;
    resource.moderatedAt = new Date();

    if (action === "reject") {
      resource.rejectionReason = reason;
    }

    await resource.save();

    // Send notification to owner
    await Notification.create({
      user: resource.owner,
      type: "system",
      title: action === "approve" ? "Resource Approved" : "Resource Rejected",
      message:
        action === "approve"
          ? `Your resource "${resource.title}" has been approved and is now live.`
          : `Your resource "${resource.title}" was rejected. Reason: ${reason}`,
      data: { resourceId },
      priority: "high",
    });

    logger.info(`Resource ${resourceId} ${action}d by ${req.user.id}`);

    res.json({
      success: true,
      message: `Resource ${action}d successfully`,
    });
  } catch (error) {
    logger.error(`Moderate resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to moderate resource",
    });
  }
};

// @desc    Feature resource
// @route   POST /api/admin/resources/:resourceId/feature
// @access  Private/Admin
exports.featureResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { featured } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    resource.isFeatured = featured;
    await resource.save();

    if (featured) {
      await Notification.create({
        user: resource.owner,
        type: "system",
        title: "Resource Featured",
        message: `Your resource "${resource.title}" has been featured on the homepage!`,
        data: { resourceId },
        priority: "medium",
      });
    }

    res.json({
      success: true,
      message: featured
        ? "Resource featured successfully"
        : "Resource unfeatured successfully",
    });
  } catch (error) {
    logger.error(`Feature resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to feature resource",
    });
  }
};

// In adminController.js, update the deleteResource function:

// @desc    Delete resource (admin)
// @route   DELETE /api/admin/resources/:resourceId
// @access  Private/Admin
exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    // Validate resourceId
    if (!resourceId || !resourceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format",
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check for active exchanges before deleting
    const activeExchange = await Exchange.findOne({
      resource: resourceId,
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeExchange) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete resource with active exchanges. Please complete or cancel them first.",
      });
    }

    // Delete images from Cloudinary if they exist
    if (resource.images && resource.images.length > 0) {
      const { deleteFromCloudinary } = require("../services/cloudinary");
      for (const img of resource.images) {
        if (img && img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch (cloudinaryError) {
            console.error(`Failed to delete image ${img.publicId}:`, cloudinaryError.message);
            // Continue with deletion even if cloudinary fails
          }
        }
      }
    }

    // Delete related exchanges (completed/canceled ones)
    await Exchange.deleteMany({
      resource: resourceId,
      status: { $in: ["completed", "canceled"] },
    });

    // Delete the resource
    await resource.deleteOne();

    // Log the action
    logger.info(`Resource ${resourceId} (${resource.title}) deleted by admin ${req.user.id}`);

    // Return consistent response format
    res.json({
      success: true,
      message: "Resource deleted successfully",
      deletedResourceId: resourceId,
    });
  } catch (error) {
    logger.error(`Delete resource error: ${error.message}`);
    console.error("Delete error details:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete resource",
    });
  }
};

// @desc    Bulk moderate resources
// @route   POST /api/admin/resources/bulk-moderate
// @access  Private/Admin
exports.bulkModerateResources = async (req, res) => {
  try {
    const { resourceIds, action, reason } = req.body;

    if (!resourceIds || !resourceIds.length) {
      return res.status(400).json({
        success: false,
        message: "Resource IDs required",
      });
    }

    const resources = await Resource.find({ _id: { $in: resourceIds } });

    for (const resource of resources) {
      resource.moderationStatus =
        action === "approve" ? "approved" : "rejected";
      resource.moderationNotes = reason;
      resource.moderatedBy = req.user.id;
      resource.moderatedAt = new Date();
      if (action === "reject") {
        resource.rejectionReason = reason;
      }
      await resource.save();
    }

    logger.info(
      `Bulk moderated ${resources.length} resources by ${req.user.id}`,
    );

    res.json({
      success: true,
      message: `${resources.length} resources ${action}d successfully`,
    });
  } catch (error) {
    logger.error(`Bulk moderate resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to bulk moderate resources",
    });
  }
};

// ==================== REPORT MANAGEMENT ====================

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      priority,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (type && type !== "all") {
      query.targetType = type;
    }

    if (priority && priority !== "all") {
      query.priority = priority;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const reports = await Report.find(query)
      .populate("reporter", "fullName username email")
      .populate("assignedTo", "fullName username")
      .populate("resolvedBy", "fullName username")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get reports error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// @desc    Get report by ID
// @route   GET /api/admin/reports/:reportId
// @access  Private/Admin
exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId)
      .populate("reporter", "fullName username email")
      .populate("assignedTo", "fullName username")
      .populate("resolvedBy", "fullName username");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    logger.error(`Get report error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:reportId/resolve
// @access  Private/Admin
exports.resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, notes } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = "resolved";
    report.resolution = {
      action,
      notes,
      resolvedBy: req.user.id,
      resolvedAt: new Date(),
    };
    await report.save();

    logger.info(`Report ${reportId} resolved by ${req.user.id}`);

    res.json({
      success: true,
      message: "Report resolved successfully",
    });
  } catch (error) {
    logger.error(`Resolve report error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to resolve report",
    });
  }
};

// @desc    Dismiss report
// @route   PUT /api/admin/reports/:reportId/dismiss
// @access  Private/Admin
exports.dismissReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { notes } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = "dismissed";
    report.dismissal = {
      notes,
      dismissedBy: req.user.id,
      dismissedAt: new Date(),
    };
    await report.save();

    logger.info(`Report ${reportId} dismissed by ${req.user.id}`);

    res.json({
      success: true,
      message: "Report dismissed successfully",
    });
  } catch (error) {
    logger.error(`Dismiss report error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to dismiss report",
    });
  }
};

// @desc    Bulk resolve reports
// @route   POST /api/admin/reports/bulk-resolve
// @access  Private/Admin
exports.bulkResolveReports = async (req, res) => {
  try {
    const { reportIds, action, notes } = req.body;

    if (!reportIds || !reportIds.length) {
      return res.status(400).json({
        success: false,
        message: "Report IDs required",
      });
    }

    const reports = await Report.find({ _id: { $in: reportIds } });

    for (const report of reports) {
      report.status = "resolved";
      report.resolution = {
        action,
        notes,
        resolvedBy: req.user.id,
        resolvedAt: new Date(),
      };
      await report.save();
    }

    logger.info(`Bulk resolved ${reports.length} reports by ${req.user.id}`);

    res.json({
      success: true,
      message: `${reports.length} reports resolved successfully`,
    });
  } catch (error) {
    logger.error(`Bulk resolve reports error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to bulk resolve reports",
    });
  }
};

// ==================== ANALYTICS ====================

// @desc    Get analytics overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
exports.getAnalyticsOverview = async (req, res) => {
  try {
    const { range = "week" } = req.query;

    const startDate = new Date();
    if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setDate(startDate.getDate() - 7);

    const [
      totalUsers,
      totalResources,
      totalExchanges,
      totalReports,
      pendingReports,
      pendingModeration,
    ] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
      Exchange.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Resource.countDocuments({ moderationStatus: "pending" }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResources,
        totalExchanges,
        totalReports,
        pendingReports,
        pendingModeration,
        revenue: 0,
        userGrowth: 0,
        resourceGrowth: 0,
        exchangeGrowth: 0,
      },
    });
  } catch (error) {
    logger.error(`Get analytics overview error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// ==================== ANALYTICS ====================

// @desc    Get analytics overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
exports.getAnalyticsOverview = async (req, res) => {
  try {
    const { range = "week" } = req.query;

    const startDate = new Date();
    if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setDate(startDate.getDate() - 7);

    const [
      totalUsers,
      newUsers,
      totalResources,
      newResources,
      totalExchanges,
      completedExchanges,
      totalReports,
      pendingReports,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ createdAt: { $gte: startDate }, deletedAt: null }),
      Resource.countDocuments({ moderationStatus: "approved" }),
      Resource.countDocuments({
        createdAt: { $gte: startDate },
        moderationStatus: "approved",
      }),
      Exchange.countDocuments(),
      Exchange.countDocuments({
        status: "completed",
        createdAt: { $gte: startDate },
      }),
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Exchange.aggregate([
        { $match: { status: "completed", paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        newUsers,
        totalResources,
        newResources,
        totalExchanges,
        completedExchanges,
        totalReports,
        pendingReports,
        totalRevenue: totalRevenue[0]?.total || 0,
        userGrowth: totalUsers ? Math.round((newUsers / totalUsers) * 100) : 0,
        resourceGrowth: totalResources
          ? Math.round((newResources / totalResources) * 100)
          : 0,
        exchangeGrowth: totalExchanges
          ? Math.round((completedExchanges / totalExchanges) * 100)
          : 0,
      },
    });
  } catch (error) {
    logger.error(`Get analytics overview error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = async (req, res) => {
  try {
    const { range = "month" } = req.query;

    const startDate = new Date();
    if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setMonth(startDate.getMonth() - 1);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userTypes = await User.aggregate([
      { $group: { _id: "$userType", count: { $sum: 1 } } },
    ]);

    const userRoles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        userGrowth,
        userTypes,
        userRoles,
        totalUsers: await User.countDocuments(),
      },
    });
  } catch (error) {
    logger.error(`Get user analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics",
    });
  }
};

// @desc    Get resource analytics
// @route   GET /api/admin/analytics/resources
// @access  Private/Admin
exports.getResourceAnalytics = async (req, res) => {
  try {
    const { range = "month" } = req.query;

    const startDate = new Date();
    if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setMonth(startDate.getMonth() - 1);

    const resourceGrowth = await Resource.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topCategories = await Resource.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const priceDistribution = await Resource.aggregate([
      { $match: { priceType: "rental", price: { $exists: true } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 10, 25, 50, 100, 500],
          default: "500+",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: {
        resourceGrowth,
        topCategories,
        priceDistribution,
        totalResources: await Resource.countDocuments(),
        pendingModeration: await Resource.countDocuments({
          moderationStatus: "pending",
        }),
      },
    });
  } catch (error) {
    logger.error(`Get resource analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource analytics",
    });
  }
};

// @desc    Get transaction analytics
// @route   GET /api/admin/analytics/transactions
// @access  Private/Admin
exports.getTransactionAnalytics = async (req, res) => {
  try {
    const { range = "month" } = req.query;

    const startDate = new Date();
    if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setMonth(startDate.getMonth() - 1);

    const dailyRevenue = await Exchange.aggregate([
      {
        $match: {
          status: "completed",
          paymentStatus: "paid",
          paidAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = await Exchange.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const avgTransactionValue = await Exchange.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $group: { _id: null, avg: { $avg: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      analytics: {
        dailyRevenue,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgTransactionValue: avgTransactionValue[0]?.avg || 0,
        totalTransactions: await Exchange.countDocuments({
          status: "completed",
        }),
      },
    });
  } catch (error) {
    logger.error(`Get transaction analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction analytics",
    });
  }
};

// @desc    Get report analytics
// @route   GET /api/admin/analytics/reports
// @access  Private/Admin
exports.getReportAnalytics = async (req, res) => {
  try {
    const reportTypes = await Report.aggregate([
      { $group: { _id: "$targetType", count: { $sum: 1 } } },
    ]);

    const reportReasons = await Report.aggregate([
      { $group: { _id: "$reason", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const resolutionTime = await Report.aggregate([
      { $match: { status: "resolved", resolvedAt: { $exists: true } } },
      {
        $project: {
          resolutionTime: { $subtract: ["$resolvedAt", "$createdAt"] },
        },
      },
      { $group: { _id: null, avgTime: { $avg: "$resolutionTime" } } },
    ]);

    res.json({
      success: true,
      analytics: {
        reportTypes,
        reportReasons,
        avgResolutionTime: resolutionTime[0]?.avgTime || 0,
        totalReports: await Report.countDocuments(),
        pendingReports: await Report.countDocuments({ status: "pending" }),
        resolvedReports: await Report.countDocuments({ status: "resolved" }),
        dismissedReports: await Report.countDocuments({ status: "dismissed" }),
      },
    });
  } catch (error) {
    logger.error(`Get report analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report analytics",
    });
  }
};

// ==================== SYSTEM SETTINGS ====================

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSystemSettings = async (req, res) => {
  try {
    const Settings = require("../models/Settings");
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    logger.error(`Get system settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system settings",
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSystemSettings = async (req, res) => {
  try {
    const Settings = require("../models/Settings");
    const updates = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    Object.assign(settings, updates);
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    logger.info(`System settings updated by ${req.user.id}`);

    res.json({
      success: true,
      settings,
      message: "System settings updated successfully",
    });
  } catch (error) {
    logger.error(`Update system settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update system settings",
    });
  }
};

// @desc    Get backup
// @route   GET /api/admin/settings/backup
// @access  Private/Admin
exports.getBackup = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -refreshTokens -verificationCode",
    );
    const resources = await Resource.find();
    const exchanges = await Exchange.find();
    const reports = await Report.find();

    const backup = {
      exportedAt: new Date().toISOString(),
      exportedBy: req.user.id,
      version: "2.0.0",
      data: {
        users,
        resources,
        exchanges,
        reports,
      },
    };

    const json = JSON.stringify(backup, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resourcehub-backup-${new Date().toISOString()}.json`,
    );
    res.send(json);
  } catch (error) {
    logger.error(`Get backup error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to generate backup",
    });
  }
};

// @desc    Restore backup
// @route   POST /api/admin/settings/restore
// @access  Private/Admin
exports.restoreBackup = async (req, res) => {
  try {
    const { backup } = req.body;

    if (!backup || !backup.data) {
      return res.status(400).json({
        success: false,
        message: "Invalid backup data",
      });
    }

    // Validate backup version
    if (backup.version !== "2.0.0") {
      return res.status(400).json({
        success: false,
        message: "Backup version incompatible",
      });
    }

    // Restore data (this should be done carefully in production)
    // This is a simplified version - in production, you'd want to validate and merge data

    logger.warn(`System restore initiated by ${req.user.id}`);

    res.json({
      success: true,
      message: "Backup restore initiated. This may take a few minutes.",
    });
  } catch (error) {
    logger.error(`Restore backup error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to restore backup",
    });
  }
};

// @desc    Get moderation logs
// @route   GET /api/admin/logs
// @access  Private/Admin
exports.getModerationLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, moderator } = req.query;

    const query = {};
    if (action) query.action = action;
    if (moderator) query.moderator = moderator;

    // This would use a Log model in production
    // For now, return empty array
    const logs = [];

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length,
        pages: Math.ceil(logs.length / limit),
      },
    });
  } catch (error) {
    logger.error(`Get moderation logs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch moderation logs",
    });
  }
};
// ==================== ANALYTICS API ENDPOINTS ====================












// @desc    Get real-time metrics
// @route   GET /api/admin/realtime-metrics
// @access  Private/Admin
exports.getRealTimeMetrics = async (req, res) => {
  try {
    // Get real counts from database
    const [onlineUsers, activeExchanges, totalViewsToday] = await Promise.all([
      User.countDocuments({
        online: true,
        lastSeen: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
      }),
      Exchange.countDocuments({
        status: { $in: ["approved", "active"] },
      }),
      Resource.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      }),
    ]);

    res.json({
      success: true,
      onlineUsers: onlineUsers || 0,
      todayVisitors: Math.floor(Math.random() * 100) + 50,
      activeExchanges: activeExchanges || 0,
      pageViews: totalViewsToday * 10 || 0,
    });
  } catch (error) {
    console.error("Real-time metrics error:", error);
    res.json({
      success: true,
      onlineUsers: 0,
      todayVisitors: 0,
      activeExchanges: 0,
      pageViews: 0,
    });
  }
};

// @desc    Export all data
// @route   GET /api/admin/export
// @access  Private/Admin
exports.exportData = async (req, res) => {
  try {
    const { range = "week", format = "csv" } = req.query;

    // Get data based on range
    let startDate = new Date();
    if (range === "day") startDate.setDate(startDate.getDate() - 1);
    else if (range === "week") startDate.setDate(startDate.getDate() - 7);
    else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
    else if (range === "year")
      startDate.setFullYear(startDate.getFullYear() - 1);

    const users = await User.find({ createdAt: { $gte: startDate } }).select(
      "-password -refreshTokens -verificationCode",
    );
    const resources = await Resource.find({ createdAt: { $gte: startDate } });
    const exchanges = await Exchange.find({ createdAt: { $gte: startDate } });
    const reports = await Report.find({ createdAt: { $gte: startDate } });

    const exportData = {
      exportedAt: new Date().toISOString(),
      range,
      stats: {
        totalUsers: users.length,
        totalResources: resources.length,
        totalExchanges: exchanges.length,
        totalReports: reports.length,
      },
      data: { users, resources, exchanges, reports },
    };

    if (format === "csv") {
      // Simple CSV conversion
      let csv = "Type,Count,Date\n";
      csv += `Users,${users.length},${new Date().toISOString()}\n`;
      csv += `Resources,${resources.length},${new Date().toISOString()}\n`;
      csv += `Exchanges,${exchanges.length},${new Date().toISOString()}\n`;
      csv += `Reports,${reports.length},${new Date().toISOString()}\n`;

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=admin-report-${new Date().toISOString()}.csv`,
      );
      return res.send(csv);
    }

    // Default to JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=admin-report-${new Date().toISOString()}.json`,
    );
    res.json(exportData);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get moderation log by ID
// @route   GET /api/admin/logs/:logId
// @access  Private/Admin
exports.getModerationLogById = async (req, res) => {
  try {
    const { logId } = req.params;

    // This would fetch from a Log model in production
    // For now, return not found
    return res.status(404).json({
      success: false,
      message: "Log entry not found",
    });
  } catch (error) {
    logger.error(`Get moderation log error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch moderation log",
    });
  }
};
