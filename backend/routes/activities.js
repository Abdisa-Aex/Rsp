const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const activityController = require("../controllers/activityController");

// Routes
router.post("/:activityId/like", auth, activityController.likeActivity);
router.delete("/:activityId/like", auth, activityController.unlikeActivity);

// Optional: Get activities with like status
router.get("/", auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const Activity = require("../models/Activity");
    const userId = req.user.id;

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    // Add liked status for current user
    const activitiesWithLikeStatus = activities.map((activity) => ({
      ...activity,
      liked: activity.likedBy?.some((id) => id.toString() === userId) || false,
    }));

    res.json({
      success: true,
      activities: activitiesWithLikeStatus,
      hasMore: activities.length === parseInt(limit),
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
