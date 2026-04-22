const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const adminController = require("../controllers/adminController");
const User = require("../models/User");
const Resource = require("../models/Resource");
const Exchange = require("../models/Exchange");
const Report = require("../models/Report");

// All admin routes require authentication and admin role
router.use(auth);
router.use(admin.isAdmin);

// ==================== DASHBOARD STATS ====================
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalExchanges = await Exchange.countDocuments();
    const pendingModeration = await Resource.countDocuments({
      moderationStatus: "pending",
    });
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalResources: totalResources || 0,
        totalExchanges: totalExchanges || 0,
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0,
        pendingModeration: pendingModeration || 0,
        revenue: 0,
        userGrowth: 0,
        resourceGrowth: 0,
        exchangeGrowth: 0,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stats: {
        totalUsers: 0,
        totalResources: 0,
        totalExchanges: 0,
        totalReports: 0,
        pendingReports: 0,
        pendingModeration: 0,
        revenue: 0,
        userGrowth: 0,
        resourceGrowth: 0,
        exchangeGrowth: 0,
      },
    });
  }
});

router.get("/activities", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recentResources = await Resource.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("owner", "fullName");

    const formattedActivities = (recentResources || []).map((a) => ({
      type: "resource_shared",
      description: `${a.owner?.fullName || "Someone"} shared "${a.title || "a resource"}"`,
      timeAgo: getTimeAgo(a.createdAt),
    }));

    res.json({ success: true, activities: formattedActivities || [] });
  } catch (error) {
    console.error("Activities error:", error);
    res.json({ success: true, activities: [], error: error.message });
  }
});

router.get("/top-resources", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const resources = await Resource.find({})
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .select("title category views");
    res.json({ success: true, resources: resources || [] });
  } catch (error) {
    console.error("Top resources error:", error);
    res.json({ success: true, resources: [], error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================
router.get("/users", adminController.getUsers);
router.get("/users/:userId", adminController.getUserById);
router.put("/users/:userId/ban", adminController.banUser);
router.put("/users/:userId/unban", adminController.unbanUser);
router.put("/users/:userId/role", adminController.updateUserRole);
router.delete("/users/:userId", adminController.deleteUser);
router.post("/users/:userId/impersonate", adminController.impersonateUser);

// ==================== RESOURCE MODERATION ====================
router.get("/resources", adminController.getResources);
router.get("/resources/:resourceId", adminController.getResourceById);
router.post(
  "/resources/:resourceId/moderate",
  adminController.moderateResource,
);
router.post("/resources/:resourceId/feature", adminController.featureResource);
router.delete("/resources/:resourceId", adminController.deleteResource);
router.post("/resources/bulk-moderate", adminController.bulkModerateResources);

// ==================== REPORT MANAGEMENT ====================
router.get("/reports", adminController.getReports);
router.get("/reports/:reportId", adminController.getReportById);
router.put("/reports/:reportId/resolve", adminController.resolveReport);
router.put("/reports/:reportId/dismiss", adminController.dismissReport);
router.post("/reports/bulk-resolve", adminController.bulkResolveReports);

// ==================== BADGE MANAGEMENT ====================
router.get("/badges", adminController.getBadges);
router.post("/badges", adminController.createBadge);
router.put("/badges/:badgeId", adminController.updateBadge);
router.delete("/badges/:badgeId", adminController.deleteBadge);

// ==================== ANALYTICS (NO DUPLICATES) ====================
router.get("/analytics/overview", adminController.getAnalyticsOverview);
router.get("/analytics/users", adminController.getUserAnalytics);
router.get("/analytics/resources", adminController.getResourceAnalytics);
router.get("/analytics/transactions", adminController.getTransactionAnalytics);
router.get("/analytics/categories", adminController.getCategoryAnalytics);
router.get("/analytics/reports", adminController.getReportAnalytics);
router.get("/analytics/geographic", adminController.getGeographicAnalytics);
router.get("/analytics/devices", adminController.getDeviceAnalytics);
router.get("/realtime-metrics", adminController.getRealTimeMetrics);
router.get("/export", adminController.exportData);
router.get("/analytics/revenue", adminController.getRevenueAnalytics);
router.get("/analytics/geographic", adminController.getGeographicAnalytics);
router.get("/analytics/devices", adminController.getDeviceAnalytics);
// ==================== SYSTEM SETTINGS ====================
router.get("/settings", adminController.getSystemSettings);
router.put("/settings", adminController.updateSystemSettings);
router.get("/settings/backup", adminController.getBackup);
router.post("/settings/restore", adminController.restoreBackup);

// ==================== MODERATION LOGS ====================
router.get("/logs", adminController.getModerationLogs);
router.get("/logs/:logId", adminController.getModerationLogById);

// Helper function
function getTimeAgo(date) {
  if (!date) return "recently";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} weeks ago`;
}

module.exports = router;
