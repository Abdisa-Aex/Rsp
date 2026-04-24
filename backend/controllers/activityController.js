const Activity = require("../models/Activity");
const User = require("../models/User");
const { logger } = require("../utils/logger");

// @desc    Like an activity
// @route   POST /api/activities/:activityId/like
// @access  Private
exports.likeActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    // Find activity
    let activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if already liked
    if (activity.likedBy && activity.likedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already liked this activity",
      });
    }

    // Add like
    if (!activity.likedBy) activity.likedBy = [];
    activity.likedBy.push(userId);
    activity.likes = (activity.likes || 0) + 1;

    await activity.save();

    res.json({
      success: true,
      likes: activity.likes,
      liked: true,
      message: "Activity liked",
    });
  } catch (error) {
    logger.error("Like activity error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unlike an activity
// @route   DELETE /api/activities/:activityId/like
// @access  Private
exports.unlikeActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    let activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Remove like
    activity.likedBy = activity.likedBy.filter(
      (id) => id.toString() !== userId,
    );
    activity.likes = Math.max(0, (activity.likes || 0) - 1);

    await activity.save();

    res.json({
      success: true,
      likes: activity.likes,
      liked: false,
      message: "Activity unliked",
    });
  } catch (error) {
    logger.error("Unlike activity error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
