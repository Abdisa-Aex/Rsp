const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const uploadController = require("../controllers/uploadController");
const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many uploads, please try again later",
  },
});

// All upload routes require authentication
router.use(auth);

// Single file upload
router.post(
  "/single",
  uploadLimiter,
  upload.single("file"),
  uploadController.uploadSingle,
);
router.post(
  "/message",
  auth,
  upload.single("file"),
  uploadController.uploadMessageFile,
);
router.post(
  "/message",
  auth,
  upload.single("file"),
  uploadController.uploadMessageFile,
);
// Multiple files upload
router.post(
  "/multiple",
  uploadLimiter,
  upload.array("files", 10),
  uploadController.uploadMultiple,
);

// Avatar upload
router.post(
  "/avatar",
  uploadLimiter,
  upload.single("avatar"),
  uploadController.uploadAvatar,
);

// Resource images upload
router.post(
  "/resource",
  uploadLimiter,
  upload.array("images", 10),
  uploadController.uploadResourceImages,
);

// Delete file
router.delete("/:publicId", uploadController.deleteFile);

module.exports = router;
