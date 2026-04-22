const Notification = require("../models/Notification");
const User = require("../models/User");
const PushToken = require("../models/PushToken");
const {
  sendPushNotification,
  sendMulticastPushNotification,
} = require("../config/firebase");
const { logger } = require("../utils/logger");

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notificationPreferences");
    res.json({
      success: true,
      preferences: user.notificationPreferences || {
        email: true,
        push: true,
        sms: false,
        messages: true,
        requests: true,
        returns: true,
        reviews: true,
        system: true,
        promotions: false,
        achievements: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    await User.findByIdAndUpdate(req.user.id, { notificationPreferences: preferences });
    res.json({ success: true, message: "Preferences updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all as read (PUT version)
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, unreadOnly = false } = req.query;

    const query = { user: req.user.id };

    if (type && type !== "all") {
      query.type = type;
    }

    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    logger.error(`Get unread count error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      _id: notificationId,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete all notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
    });
  }
};

// @desc    Register push token
// @route   POST /api/notifications/push/register
// @access  Private
exports.registerPushToken = async (req, res) => {
  try {
    const { token, platform, deviceInfo } = req.body;

    if (!token || !platform) {
      return res.status(400).json({
        success: false,
        message: "Token and platform are required",
      });
    }

    // Find existing token
    let pushToken = await PushToken.findOne({ token });

    if (pushToken) {
      // Update existing token
      pushToken.user = req.user.id;
      pushToken.platform = platform;
      pushToken.deviceInfo = deviceInfo;
      pushToken.lastUsed = new Date();
      pushToken.isActive = true;
      await pushToken.save();
    } else {
      // Create new token
      pushToken = new PushToken({
        user: req.user.id,
        token,
        platform,
        deviceInfo,
      });
      await pushToken.save();
    }

    // Also update user's pushTokens array
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        pushTokens: {
          token,
          platform,
          deviceInfo,
          lastUsed: new Date(),
        },
      },
    });

    logger.info(`Push token registered for user ${req.user.id}`);

    res.json({
      success: true,
      message: "Push token registered successfully",
    });
  } catch (error) {
    logger.error(`Register push token error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to register push token",
    });
  }
};

// @desc    Unregister push token
// @route   POST /api/notifications/push/unregister
// @access  Private
exports.unregisterPushToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Remove from PushToken collection
    await PushToken.findOneAndDelete({ token, user: req.user.id });

    // Remove from user's pushTokens array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { pushTokens: { token } },
    });

    logger.info(`Push token unregistered for user ${req.user.id}`);

    res.json({
      success: true,
      message: "Push token unregistered successfully",
    });
  } catch (error) {
    logger.error(`Unregister push token error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unregister push token",
    });
  }
};

// @desc    Send test notification
// @route   POST /api/notifications/push/test
// @access  Private
exports.sendTestNotification = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const result = await sendPushNotification(
      token,
      "Test Notification",
      "This is a test notification from ResourceHub!",
      { type: "test", timestamp: new Date().toISOString() },
      { priority: "high", sound: "default" },
    );

    if (result.success) {
      res.json({
        success: true,
        message: "Test notification sent",
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error,
      });
    }
  } catch (error) {
    logger.error(`Send test notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send test notification",
    });
  }
};

// @desc    Subscribe to topic
// @route   POST /api/notifications/push/subscribe
// @access  Private
exports.subscribeToTopic = async (req, res) => {
  try {
    const { topic, token } = req.body;

    if (!topic || !token) {
      return res.status(400).json({
        success: false,
        message: "Topic and token are required",
      });
    }

    const { subscribeToTopic } = require("../config/firebase");
    const result = await subscribeToTopic(token, topic);

    if (result.success) {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { subscribedTopics: topic },
      });
    }

    res.json(result);
  } catch (error) {
    logger.error(`Subscribe to topic error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe to topic",
    });
  }
};

// @desc    Unsubscribe from topic
// @route   POST /api/notifications/push/unsubscribe
// @access  Private
exports.unsubscribeFromTopic = async (req, res) => {
  try {
    const { topic, token } = req.body;

    if (!topic || !token) {
      return res.status(400).json({
        success: false,
        message: "Topic and token are required",
      });
    }

    const { unsubscribeFromTopic } = require("../config/firebase");
    const result = await unsubscribeFromTopic(token, topic);

    if (result.success) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedTopics: topic },
      });
    }

    res.json(result);
  } catch (error) {
    logger.error(`Unsubscribe from topic error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe from topic",
    });
  }
};

// @desc    Get user push tokens
// @route   GET /api/notifications/push/tokens
// @access  Private
exports.getUserPushTokens = async (req, res) => {
  try {
    const tokens = await PushToken.find({ user: req.user.id, isActive: true });

    res.json({
      success: true,
      tokens: tokens.map((t) => ({
        id: t._id,
        token: t.token,
        platform: t.platform,
        deviceInfo: t.deviceInfo,
        lastUsed: t.lastUsed,
      })),
    });
  } catch (error) {
    logger.error(`Get user push tokens error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get push tokens",
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      $set: { notificationPreferences: preferences },
    });

    res.json({
      success: true,
      message: "Notification preferences updated",
    });
  } catch (error) {
    logger.error(`Update notification preferences error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update notification preferences",
    });
  }
};

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "notificationPreferences",
    );

    res.json({
      success: true,
      preferences: user.notificationPreferences || {
        messages: true,
        requests: true,
        returns: true,
        reviews: true,
        promotions: false,
        system: true,
      },
    });
  } catch (error) {
    logger.error(`Get notification preferences error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get notification preferences",
    });
  }
};
