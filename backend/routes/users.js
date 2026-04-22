const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");

// Log available functions
console.log("Available userController functions:", Object.keys(userController));

// Validation rules
const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("location").optional().trim(),
  body("interests").optional().isArray(),
  body("skills").optional().isArray(),
  body("preferences").optional().isObject(),
  body("sharingPreferences").optional().isObject(),
];

const userIdParamValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
];

// Check each function before using
const safeHandler = (handler, name) => {
  if (typeof handler !== "function") {
    console.error(`ERROR: ${name} is not a function!`);
    return (req, res) =>
      res
        .status(500)
        .json({ success: false, message: `Handler ${name} not implemented` });
  }
  return handler;
};

// ============ CURRENT USER ROUTES ============
router.get("/me", auth, safeHandler(userController.getProfile, "getProfile"));
router.put(
  "/me",
  auth,
  updateProfileValidation,
  validate,
  safeHandler(userController.updateProfile, "updateProfile"),
);
router.delete(
  "/me",
  auth,
  safeHandler(userController.deleteAccount, "deleteAccount"),
);
router.post(
  "/me/restore",
  auth,
  safeHandler(userController.restoreAccount, "restoreAccount"),
);
router.post(
  "/me/avatar",
  auth,
  safeHandler(userController.uploadAvatar, "uploadAvatar"),
);
router.get(
  "/me/export",
  auth,
  safeHandler(userController.exportData, "exportData"),
);
router.get("/me/stats", auth, safeHandler(userController.getStats, "getStats"));
router.get(
  "/me/badges",
  auth,
  safeHandler(userController.getBadges, "getBadges"),
);
router.get(
  "/me/items",
  auth,
  safeHandler(userController.getUserItems, "getUserItems"),
);
router.get(
  "/me/exchanges",
  auth,
  safeHandler(userController.getMyExchanges, "getMyExchanges"),
);
router.get(
  "/me/reviews",
  auth,
  safeHandler(userController.getUserReviews, "getUserReviews"),
);
router.get(
  "/me/activities",
  auth,
  safeHandler(userController.getActivities, "getActivities"),
);
router.get(
  "/me/analytics",
  auth,
  safeHandler(userController.getUserAnalytics, "getUserAnalytics"),
);
router.get(
  "/me/sessions",
  auth,
  safeHandler(userController.getSessions, "getSessions"),
);

// ============ USER SEARCH ============
router.get(
  "/search",
  auth,
  safeHandler(userController.searchUsers, "searchUsers"),
);

// ============ ADMIN ROUTES ============
router.get("/", auth, safeHandler(userController.getUsers, "getUsers"));

// ============ USER BY ID ROUTES ============
router.get(
  "/:userId",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserById, "getUserById"),
);
router.get(
  "/:userId/resources",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserResources, "getUserResources"),
);
router.get(
  "/:userId/exchanges",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserExchanges, "getUserExchanges"),
);
router.get(
  "/:userId/reviews",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserReviewsById, "getUserReviewsById"),
);
router.get(
  "/:userId/achievements",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserAchievements, "getUserAchievements"),
);
router.get(
  "/:userId/stats",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserStats, "getUserStats"),
);
router.get(
  "/:userId/activities",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.getUserActivities, "getUserActivities"),
);
router.post(
  "/:userId/block",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.blockUser, "blockUser"),
);
router.post(
  "/:userId/unblock",
  auth,
  userIdParamValidation,
  validate,
  safeHandler(userController.unblockUser, "unblockUser"),
);

module.exports = router;
