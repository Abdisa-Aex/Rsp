const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const upload = require("../middleware/upload");

// Validation rules
const sendMessageValidation = [
  body("conversationId").isMongoId().withMessage("Invalid conversation ID"),
  body("text")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Message too long"),
  body("type")
    .optional()
    .isIn([
      "text",
      "image",
      "video",
      "audio",
      "file",
      "location",
      "contact",
      "poll",
    ]),
  body("replyToId").optional().isMongoId(),
  body("location").optional().isObject(),
  body("contact").optional().isObject(),
  body("poll").optional().isObject(),
];

const createConversationValidation = [
  body("participantId").isMongoId().withMessage("Invalid participant ID"),
  body("resourceId").optional().isMongoId(),
];

const messageIdParamValidation = [
  param("messageId").isMongoId().withMessage("Invalid message ID"),
];

const conversationIdParamValidation = [
  param("conversationId").isMongoId().withMessage("Invalid conversation ID"),
];

// ============ VOICE MESSAGE ============
router.post(
  "/voice",
  auth,
  upload.single("audio"),
  messageController.uploadVoiceMessage,
);

// ============ CONVERSATION ROUTES ============
router.get("/conversations", auth, messageController.getConversations);
router.get(
  "/conversations/:conversationId",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.getConversation,
);
router.post(
  "/conversations",
  auth,
  createConversationValidation,
  validate,
  messageController.createConversation,
);
router.delete(
  "/conversations/:conversationId",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.deleteConversation,
);
router.put(
  "/conversations/:conversationId/read",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.markConversationRead,
);
router.put(
  "/conversations/:conversationId/mute",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.muteConversation,
);
router.put(
  "/conversations/:conversationId/unmute",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.unmuteConversation,
);
router.put(
  "/conversations/:conversationId/pin",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.pinConversation,
);
router.put(
  "/conversations/:conversationId/unpin",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.unpinConversation,
);
router.put(
  "/conversations/:conversationId/archive",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.archiveConversation,
);
router.put(
  "/conversations/:conversationId/unarchive",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.unarchiveConversation,
);

// ============ MESSAGE ROUTES ============
router.get(
  "/:conversationId",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.getMessages,
);
router.post(
  "/",
  auth,
  sendMessageValidation,
  validate,
  messageController.sendMessage,
);
router.put(
  "/:messageId",
  auth,
  messageIdParamValidation,
  validate,
  messageController.editMessage,
);
router.delete(
  "/:messageId",
  auth,
  messageIdParamValidation,
  validate,
  messageController.deleteMessage,
);
router.delete(
  "/:messageId/for-everyone",
  auth,
  messageIdParamValidation,
  validate,
  messageController.deleteForEveryone,
);
router.post(
  "/:messageId/read",
  auth,
  messageIdParamValidation,
  validate,
  messageController.markAsRead,
);
router.post(
  "/:messageId/react",
  auth,
  messageIdParamValidation,
  validate,
  messageController.addReaction,
);
router.delete(
  "/:messageId/react",
  auth,
  messageIdParamValidation,
  validate,
  messageController.removeReaction,
);
router.get(
  "/:conversationId/search",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.searchMessages,
);
router.post(
  "/:conversationId/typing",
  auth,
  conversationIdParamValidation,
  validate,
  messageController.typingIndicator,
);

module.exports = router;
