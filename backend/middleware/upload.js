const multer = require("multer");
const path = require("path");
const { FILE_UPLOAD } = require("../config/constants");

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${file.mimetype} not allowed. Allowed types: ${FILE_UPLOAD.ALLOWED_TYPES.join(", ")}`,
      ),
      false,
    );
  }
};

// Create multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: FILE_UPLOAD.MAX_FILES,
  },
  fileFilter,
});

// Error handler
upload.handleError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum is ${FILE_UPLOAD.MAX_FILES}`,
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

module.exports = upload;
