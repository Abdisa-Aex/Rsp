const {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
} = require("../services/cloudinary");
const { logger } = require("../utils/logger");

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "uploads",
      public_id: `${Date.now()}_${req.file.originalname.split(".")[0]}`,
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      message: "File uploaded successfully",
    });
  } catch (error) {
    logger.error(`Upload single error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const results = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, {
        folder: "uploads",
        public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      });
      results.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        size: file.size,
      });
    }

    res.json({
      success: true,
      files: results,
      message: `${results.length} files uploaded successfully`,
    });
  } catch (error) {
    logger.error(`Upload multiple error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};
// @desc    Upload message file
// @route   POST /api/upload/message
// @access  Private
exports.uploadMessageFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "messages",
      resource_type: "auto",
      transformation: req.file.mimetype.startsWith("image/") 
        ? [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }]
        : undefined
    });

    res.json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    logger.error(`Upload message file error: ${error.message}`);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
exports.uploadMessageFile = async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "messages",
      resource_type: "auto",
    });
    res.json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Upload avatar
// @route   POST /api/upload/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "avatars",
      public_id: `user_${req.user.id}`,
      transformation: [
        { width: 300, height: 300, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    logger.error(`Upload avatar error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

// @desc    Upload resource images
// @route   POST /api/upload/resource
// @access  Private
exports.uploadResourceImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadToCloudinary(file.buffer, {
        folder: "resources",
        public_id: `${Date.now()}_${i}`,
        transformation: [
          { width: 1200, height: 900, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      images.push({
        url: result.secure_url,
        publicId: result.public_id,
        isPrimary: i === 0,
        order: i,
      });
    }

    res.json({
      success: true,
      images,
      message: `${images.length} images uploaded successfully`,
    });
  } catch (error) {
    logger.error(`Upload resource images error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:publicId
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID required",
      });
    }

    await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete file error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
