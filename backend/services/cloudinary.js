const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { logger } = require("../utils/logger");

// Configure Cloudinary with increased timeout
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000, // Increase timeout to 120 seconds
});

// Upload file to Cloudinary with retry logic
exports.uploadToCloudinary = async (buffer, options = {}, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || "resourcehub",
            public_id: options.public_id,
            transformation: options.transformation,
            resource_type: options.resource_type || "auto",
            quality: options.quality || "auto",
            fetch_format: options.fetch_format || "auto",
            timeout: 120000, // 120 seconds timeout
          },
          (error, result) => {
            if (error) {
              logger.error(
                `Cloudinary upload error (attempt ${attempt}): ${error.message}`,
              );
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      logger.warn(`Retrying upload... Attempt ${attempt} failed`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
    }
  }
};

// Delete file from Cloudinary
// Delete file from Cloudinary
exports.deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    console.log("No publicId provided, skipping deletion");
    return { result: "skipped" };
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error for ${publicId}: ${error.message}`);
    throw error;
  }
};

// Get optimized URL
exports.getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: options.transformation || [
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    ...options,
  });
};

// Upload avatar
exports.uploadAvatar = async (buffer, userId) => {
  return exports.uploadToCloudinary(buffer, {
    folder: "avatars",
    public_id: `user_${userId}`,
    transformation: [
      { width: 300, height: 300, crop: "fill" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });
};

// Upload resource images
exports.uploadResourceImages = async (files, resourceId) => {
  const images = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await exports.uploadToCloudinary(file.buffer, {
      folder: "resources",
      public_id: `${resourceId}_${Date.now()}_${i}`,
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Reduced from 1200x900
        { quality: "auto:low" }, // Lower quality for faster upload
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

  return images;
};

// Upload message attachment
exports.uploadMessageAttachment = async (buffer, messageId, type) => {
  const folder = `messages/${type}s`;
  return exports.uploadToCloudinary(buffer, {
    folder,
    public_id: `${messageId}_${Date.now()}`,
    transformation:
      type === "image"
        ? [{ width: 500, height: 500, crop: "limit" }, { quality: "auto:low" }]
        : undefined,
  });
};
