const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");

// Validation rules
const notificationIdParamValidation = [
  param("notificationId").isMongoId().withMessage("Invalid notification ID"),
];

const updatePreferencesValidation = [
  body("preferences").isObject().withMessage("Preferences object is required"),
];

const registerPushTokenValidation = [
  body("token").notEmpty().withMessage("Push token is required"),
  body("platform")
    .isIn(["web", "ios", "android"])
    .withMessage("Invalid platform"),
  body("deviceInfo").optional().isObject(),
];

// Routes
router.get("/", auth, notificationController.getNotifications);
router.get("/unread", auth, notificationController.getUnreadCount);
router.put(
  "/:notificationId/read",
  auth,
  notificationIdParamValidation,
  validate,
  notificationController.markAsRead,
);
router.put("/read-all", auth, notificationController.markAllAsRead);
router.delete(
  "/:notificationId",
  auth,
  notificationIdParamValidation,
  validate,
  notificationController.deleteNotification,
);
router.get(
  "/preferences",
  auth,
  notificationController.getNotificationPreferences,
);
router.put(
  "/preferences",
  auth,
  notificationController.updateNotificationPreferences,
);
router.delete("/", auth, notificationController.deleteAllNotifications);
router.get(
  "/preferences",
  auth,
  notificationController.getNotificationPreferences,
);
router.put(
  "/preferences",
  auth,
  notificationController.updateNotificationPreferences,
);
// Push notification routes
router.post(
  "/push/register",
  auth,
  registerPushTokenValidation,
  validate,
  notificationController.registerPushToken,
);
router.post(
  "/push/unregister",
  auth,
  notificationController.unregisterPushToken,
);
router.post("/push/test", auth, notificationController.sendTestNotification);
router.post("/push/subscribe", auth, notificationController.subscribeToTopic);
router.post(
  "/push/unsubscribe",
  auth,
  notificationController.unsubscribeFromTopic,
);
router.get("/push/tokens", auth, notificationController.getUserPushTokens);

// Preferences
router.get(
  "/preferences",
  auth,
  notificationController.getNotificationPreferences,
);
router.put(
  "/preferences",
  auth,
  updatePreferencesValidation,
  validate,
  notificationController.updateNotificationPreferences,
);

module.exports = router;
