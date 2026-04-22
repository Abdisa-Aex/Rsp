const Resource = require("../models/Resource");
const User = require("../models/User");
const Exchange = require("../models/Exchange");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity"); 
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinary");
const { sendNotificationByType } = require("../config/firebase");
const { logger } = require("../utils/logger");
const { calculateDistance } = require("../utils/helpers");


// Alias for getResourceStats
exports.getResourceStats = exports.getStats;
// @desc    Get resource statistics (alias for getResourceStats)
// @route   GET /api/resources/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const [total, byCategory, byStatus, trending, averagePrice] =
      await Promise.all([
        Resource.countDocuments({ moderationStatus: "approved" }),
        Resource.aggregate([
          { $match: { moderationStatus: "approved" } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        Resource.aggregate([
          { $match: { moderationStatus: "approved" } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Resource.countDocuments({
          isTrending: true,
          moderationStatus: "approved",
        }),
        Resource.aggregate([
          {
            $match: {
              moderationStatus: "approved",
              priceType: "rental",
              price: { $gt: 0 },
            },
          },
          { $group: { _id: null, avg: { $avg: "$price" } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        total,
        trending,
        byCategory,
        byStatus,
        averagePrice: averagePrice[0]?.avg || 0,
      },
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};

// @desc    Get resources by user ID
// @route   GET /api/resources/user/:userId
// @access  Public
exports.getUserResources = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12, status = "available" } = req.query;

    const query = {
      owner: userId,
      moderationStatus: "approved",
    };

    if (status !== "all") query.status = status;

    const resources = await Resource.find(query)
      .populate("owner", "fullName username avatar rating trustScore")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get user resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user resources",
    });
  }
};

// @desc    Get resource by slug (SEO friendly)
// @route   GET /api/resources/slug/:slug
// @access  Public
exports.getResourceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const resource = await Resource.findOne({
      slug,
      moderationStatus: "approved",
    })
      .populate(
        "owner",
        "fullName username avatar rating trustScore isVerified stats",
      )
      .populate("reviews")
      .lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Increment views
    await Resource.findByIdAndUpdate(resource._id, { $inc: { views: 1 } });

    res.json({
      success: true,
      resource,
    });
  } catch (error) {
    logger.error(`Get resource by slug error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
    });
  }
};
// @desc    Get recommended resources based on user interests
// @route   GET /api/resources/recommended
// @access  Private
exports.getRecommendedResources = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userInterests = user.interests || [];

    let query = {
      moderationStatus: "approved",
      status: "available",
      _id: { $ne: null },
    };

    // If user has interests, recommend based on them
    if (userInterests.length > 0) {
      query.category = { $in: userInterests };
    }

    const resources = await Resource.find(query)
      .populate("owner", "fullName username avatar rating trustScore")
      .sort({ rating: -1, views: -1 })
      .limit(20);

    // If not enough recommendations, add trending items
    if (resources.length < 10) {
      const trending = await Resource.find({
        moderationStatus: "approved",
        status: "available",
        _id: { $nin: resources.map((r) => r._id) },
      })
        .sort({ views: -1, rating: -1 })
        .limit(20 - resources.length);

      resources.push(...trending);
    }

    res.json({
      success: true,
      resources,
    });
  } catch (error) {
    logger.error(`Get recommended resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};
// @desc    Bulk delete resources (admin only)
// @route   DELETE /api/resources/bulk
// @access  Private/Admin
exports.bulkDeleteResources = async (req, res) => {
  try {
    const { resourceIds } = req.body;

    if (
      !resourceIds ||
      !Array.isArray(resourceIds) ||
      resourceIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Resource IDs array is required",
      });
    }

    // Check for active exchanges
    const activeExchanges = await Exchange.find({
      resource: { $in: resourceIds },
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeExchanges.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ${activeExchanges.length} resources with active exchanges`,
      });
    }

    // Delete all images from Cloudinary
    const resources = await Resource.find({ _id: { $in: resourceIds } });
    for (const resource of resources) {
      for (const img of resource.images) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    // Soft delete resources
    await Resource.updateMany(
      { _id: { $in: resourceIds } },
      { status: "deleted", deletedAt: new Date() },
    );

    res.json({
      success: true,
      message: `${resourceIds.length} resources deleted successfully`,
    });
  } catch (error) {
    logger.error(`Bulk delete resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete resources",
    });
  }
};
// @desc    Get analytics for owner's resources
// @route   GET /api/resources/analytics
// @access  Private
exports.getResourceAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const analytics = await Resource.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalRequests: { $sum: "$requests" },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          averageRating: { $avg: "$rating" },
          totalResources: { $sum: 1 },
          activeResources: {
            $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] },
          },
          borrowedResources: {
            $sum: { $cond: [{ $eq: ["$status", "borrowed"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          totalViews: 1,
          totalRequests: 1,
          totalLikes: 1,
          averageRating: 1,
          totalResources: 1,
          activeResources: 1,
          borrowedResources: 1,
          engagementRate: {
            $multiply: [
              { $divide: ["$totalRequests", { $max: ["$totalResources", 1] }] },
              100,
            ],
          },
        },
      },
    ]);

    // Get top performing resources
    const topResources = await Resource.find({ owner: userId })
      .select("title views requests rating images")
      .sort({ views: -1 })
      .limit(5);

    // Get category breakdown
    const categoryBreakdown = await Resource.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          views: { $sum: "$views" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalViews: 0,
        totalRequests: 0,
        totalLikes: 0,
        averageRating: 0,
        totalResources: 0,
        activeResources: 0,
        borrowedResources: 0,
        engagementRate: 0,
      },
      topResources,
      categoryBreakdown,
    });
  } catch (error) {
    logger.error(`Get resource analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};
// @desc    Get all resources with filtering
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      location,
      minPrice,
      maxPrice,
      minRating,
      condition,
      status = "available",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      tags,
      userId,
      isVerified,
      isTrending,
      isFeatured,
      lat,
      lng,
      distance = 10,
    } = req.query;

    const query = { moderationStatus: "approved" };

    if (status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (condition && condition !== "all") query.condition = condition;
    if (tags) query.tags = { $in: tags.split(",") };
    if (userId) query.owner = userId;
    if (isVerified === "true") query.isVerified = true;
    if (isTrending === "true") query.isTrending = true;
    if (isFeatured === "true") query.isFeatured = true;
    if (req.query.minRating)
      query.rating = { $gte: parseFloat(req.query.minRating) };
    if (req.query.distance && req.query.lat && req.query.lng) {
      // Add geospatial query
      query.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          $maxDistance: (req.query.distance || 10) * 1000,
        },
      };
    }
    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    let resources = await Resource.find(query)
      .populate(
        "owner",
        "fullName username avatar rating trustScore isVerified",
      )
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    // Calculate distance if coordinates provided
    if (lat && lng && resources.length > 0) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      resources = resources
        .map((resource) => {
          const resourceLat = resource.coordinates?.coordinates?.[1] || 0;
          const resourceLng = resource.coordinates?.coordinates?.[0] || 0;
          const dist = calculateDistance(
            userLat,
            userLng,
            resourceLat,
            resourceLng,
          );
          return { ...resource.toObject(), distance: dist };
        })
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    res.json({
      success: true,
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error(`Get resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};

// @desc    Increment resource views
// @route   POST /api/resources/:resourceId/views
// @access  Public
exports.incrementViews = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    res.json({
      success: true,
      views: resource.views,
    });
  } catch (error) {
    logger.error(`Increment views error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to increment views",
    });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:resourceId
// @access  Public
exports.getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId)
      .populate(
        "owner",
        "fullName username avatar rating trustScore isVerified stats",
      )
      .populate("reviews")
      // .lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Increment views
    await Resource.findByIdAndUpdate(resourceId, { $inc: { views: 1 } });

    // Get similar resources
    const similar = await Resource.find({
      category: resource.category,
      _id: { $ne: resourceId },
      moderationStatus: "approved",
    })
      .limit(5)
      .populate("owner", "fullName username avatar rating");

    // Check availability for next 30 days
    const availability = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const isAvailable = await resource.isAvailableForDates(date, date);
      availability.push({
        date: date.toISOString().split("T")[0],
        available: isAvailable,
      });
    }

    res.json({
      success: true,
      resource,
      similar,
      availability,
    });
  } catch (error) {
    logger.error(`Get resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
    });
  }
};


// @desc    Create resource
// @route   POST /api/resources
// @access  Private
exports.createResource = async (req, res) => {
  let images = [];

  try {
    console.log("=== CREATE RESOURCE STARTED ===");
    console.log("Files received:", req.files?.length || 0);
    console.log("Body fields:", Object.keys(req.body));

    const {
      title,
      description,
      category,
      subcategory,
      location,
      priceType,
      price,
      priceUnit,
      deposit,
      weeklyDiscount,
      monthlyDiscount,
      condition,
      brand,
      model,
      age,
      specifications,
      features,
      includedItems,
      availabilitySchedule,
      rentalTerms,
      tags,
      availabilityStart,
      availabilityEnd,
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (title.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // Check for images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ✅ FIXED: Single loop for image upload (NO NESTED LOOP)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      console.log(`Uploading image ${i + 1}/${req.files.length}...`);

      const result = await uploadToCloudinary(file.buffer, {
        folder: "resources",
        public_id: `${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`,
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto:low" },
          { fetch_format: "auto" },
        ],
      });

      images.push({
        url: result.secure_url,
        publicId: result.public_id,
        isPrimary: i === 0,
        order: i,
      });

      console.log(`Image ${i + 1} uploaded: ${result.secure_url}`);
    }

    // Parse coordinates if location provided
    let coordinates = null;
    if (req.body.lat && req.body.lng) {
      coordinates = {
        type: "Point",
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      };
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (typeof tags === "string") {
        parsedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Parse availability schedule
    let parsedSchedule = {};
    if (availabilitySchedule) {
      try {
        parsedSchedule =
          typeof availabilitySchedule === "string"
            ? JSON.parse(availabilitySchedule)
            : availabilitySchedule;
      } catch (e) {
        console.error("Error parsing availability schedule:", e);
      }
    }

    // Parse specifications
    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications =
          typeof specifications === "string"
            ? JSON.parse(specifications)
            : specifications;
      } catch (e) {
        console.error("Error parsing specifications:", e);
      }
    }

    // Parse rental terms
    let parsedRentalTerms = {};
    if (rentalTerms) {
      try {
        parsedRentalTerms =
          typeof rentalTerms === "string"
            ? JSON.parse(rentalTerms)
            : rentalTerms;
      } catch (e) {
        console.error("Error parsing rental terms:", e);
      }
    }

    // Parse features and included items
    let parsedFeatures = [];
    if (features) {
      parsedFeatures =
        typeof features === "string"
          ? features
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f)
          : features;
    }

    let parsedIncludedItems = [];
    if (includedItems) {
      parsedIncludedItems =
        typeof includedItems === "string"
          ? includedItems
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i)
          : includedItems;
    }

    // Parse price values
    const parsedPrice = price ? parseFloat(price) : 0;
    const parsedDeposit = deposit ? parseFloat(deposit) : 0;
    const parsedWeeklyDiscount = weeklyDiscount
      ? parseFloat(weeklyDiscount)
      : 0;
    const parsedMonthlyDiscount = monthlyDiscount
      ? parseFloat(monthlyDiscount)
      : 0;

    // Create resource
    const resource = new Resource({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory || undefined,
      location: location.trim(),
      coordinates,
      owner: req.user.id,
      images,
      priceType: priceType || "free",
      price: parsedPrice,
      priceUnit: priceUnit || "day",
      deposit: parsedDeposit,
      weeklyDiscount: parsedWeeklyDiscount,
      monthlyDiscount: parsedMonthlyDiscount,
      condition: condition || "good",
      brand: brand || undefined,
      model: model || undefined,
      age: age || undefined,
      specifications: parsedSpecifications,
      features: parsedFeatures,
      includedItems: parsedIncludedItems,
      availabilitySchedule: parsedSchedule,
      rentalTerms: parsedRentalTerms,
      tags: parsedTags,
      status: "available",
      availabilityDates: {
        start: availabilityStart ? new Date(availabilityStart) : null,
        end: availabilityEnd ? new Date(availabilityEnd) : null,
      },
      publishedAt: new Date(),
    });

    await resource.save();

    console.log(`✅ Resource saved successfully with ID: ${resource._id}`);
try {
  const Activity = require("../models/Activity");
  await Activity.create({
    user: req.user.id,
    action: "shared",
    item: resource.title,
    itemId: resource._id,
  });
  console.log("Activity created: shared resource");
} catch (activityError) {
  console.error("Failed to create activity:", activityError);
}
    // Update user stats
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { "stats.itemsShared": 1, points: 100 },
      });

      const user = await User.findById(req.user.id);
      if (user && typeof user.updateStats === "function") {
        await user.updateStats();
      }
    } catch (statsError) {
      console.error("Error updating user stats:", statsError.message);
    }

    res.status(201).json({
      success: true,
      resource,
      message: "Resource created successfully",
    });
  } catch (error) {
    console.error("=== CREATE RESOURCE ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Cleanup uploaded images if there was an error
    if (images && images.length > 0) {
      console.log(`Cleaning up ${images.length} uploaded images...`);
      for (const img of images) {
        if (img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch (cleanupError) {
            console.error("Error cleaning up image:", cleanupError.message);
          }
        }
      }
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "A resource with this title already exists. Please use a different title.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create resource",
    });
  }
};
// @desc    Update resource
// @route   PUT /api/resources/:resourceId
// @access  Private
exports.updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const updates = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check ownership
    if (
      resource.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this resource",
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "category",
      "subcategory",
      "location",
      "priceType",
      "price",
      "priceUnit",
      "deposit",
      "weeklyDiscount",
      "monthlyDiscount",
      "condition",
      "brand",
      "model",
      "age",
      "specifications",
      "features",
      "includedItems",
      "availabilitySchedule",
      "rentalTerms",
      "tags",
      "status",
      "availabilityStart",
      "availabilityEnd",
    ];

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        if (key === "availabilityStart" || key === "availabilityEnd") {
          if (!resource.availabilityDates) resource.availabilityDates = {};
          resource.availabilityDates[
            key === "availabilityStart" ? "start" : "end"
          ] = updates[key] ? new Date(updates[key]) : null;
        } else {
          resource[key] = updates[key];
        }
      }
    }

    // ========== FIXED: REPLACE images (delete old, add new) ==========
    if (updates.newImages && updates.newImages.length > 0) {
      // Delete old images from Cloudinary
      for (const img of resource.images) {
        if (img && img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch (err) {
            console.error("Failed to delete image:", err);
          }
        }
      }
      // Replace with new images
      resource.images = updates.newImages;
      console.log(`Replaced with ${updates.newImages.length} new images`);
    }

    // Handle file uploads (if any)
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const img of resource.images) {
        if (img && img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }

      // Upload new images
      const newImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(file.buffer, {
          folder: "resources",
          public_id: `${Date.now()}_${i}`,
          transformation: [{ width: 1200, height: 900, crop: "limit" }],
        });

        newImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: i === 0,
          order: i,
        });
      }
      resource.images = newImages;
    }

    resource.updatedAt = new Date();
    await resource.save();

    res.json({
      success: true,
      resource,
      message: "Resource updated successfully",
    });
  } catch (error) {
    logger.error(`Update resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update resource",
    });
  }
};
// @desc    Delete resource
// @route   DELETE /api/resources/:resourceId
// @access  Private
exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check ownership
    if (
      resource.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this resource",
      });
    }

    // Check for active exchanges
    const activeExchange = await Exchange.findOne({
      resource: resourceId,
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeExchange) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete resource with active exchanges",
      });
    }

    // Delete images from Cloudinary (skip if publicId is undefined)
    if (resource.images && resource.images.length > 0) {
      for (const img of resource.images) {
        if (img && img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
            console.log(`Deleted image: ${img.publicId}`);
          } catch (cloudinaryError) {
            console.error(`Failed to delete image ${img.publicId}:`, cloudinaryError.message);
            // Continue with deletion even if cloudinary fails
          }
        }
      }
    }

    // Soft delete
    resource.status = "deleted";
    resource.deletedAt = new Date();
    await resource.save();

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    logger.error(`Delete resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete resource",
      error: error.message,
    });
  }
};

// @desc    Request resource
// @route   POST /api/resources/:resourceId/request
// @access  Private
exports.requestResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { startDate, endDate, message } = req.body;

    console.log("Request received:", { resourceId, startDate, endDate });

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (resource.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Resource is not available",
      });
    }

    if (resource.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot request your own resource",
      });
    }

    // Check if user has blocked the owner
    const user = await User.findById(req.user.id);
    if (user.blockedUsers && user.blockedUsers.includes(resource.owner)) {
      return res.status(403).json({
        success: false,
        message: "You have blocked this user",
      });
    }

    // Check availability
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Calculate price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = resource.calculatePrice
      ? resource.calculatePrice(days)
      : 0;

    // Create exchange request
    const Exchange = require("../models/Exchange");
    const exchange = new Exchange({
      resource: resourceId,
      owner: resource.owner,
      borrower: req.user.id,
      startDate: start,
      endDate: end,
      duration: days,
      price: resource.price || 0,
      deposit: resource.deposit || 0,
      totalAmount: totalPrice,
      message: message || "",
      status: "pending",
    });

    await exchange.save();

    // ✅ ADD ACTIVITY FOR BORROWING
    try {
      const Activity = require("../models/Activity");
      const owner = await User.findById(resource.owner);

      await Activity.create({
        user: req.user.id,
        action: "borrowed",
        item: resource.title,
        itemId: resourceId,
        otherUser: owner.fullName,
        otherUserId: resource.owner,
      });
      console.log("✅ Borrow activity created for user:", req.user.id);
    } catch (activityError) {
      console.error("Failed to create borrow activity:", activityError.message);
    }

    // Increment requests count
    await Resource.findByIdAndUpdate(resourceId, { $inc: { requests: 1 } });

    // Create notification for owner
    const Notification = require("../models/Notification");
    await Notification.create({
      user: resource.owner,
      type: "request",
      title: "New Request",
      message: `${req.user.fullName} wants to borrow "${resource.title}"`,
      data: { exchangeId: exchange._id, resourceId },
      actionUrl: `/exchanges/${exchange._id}`,
      priority: "high",
    });

    res.status(201).json({
      success: true,
      exchange,
      totalPrice,
      message: "Request sent successfully",
    });
  } catch (error) {
    console.error("Request resource error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send request",
      error: error.message,
    });
  }
};

// @desc    Bookmark resource
// @route   POST /api/resources/:resourceId/bookmark
// @access  Private
exports.bookmarkResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.bookmarks) user.bookmarks = [];

    if (user.bookmarks.includes(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Resource already bookmarked",
      });
    }

    user.bookmarks.push(resourceId);
    await user.save();

    res.json({
      success: true,
      message: "Resource bookmarked successfully",
    });
  } catch (error) {
    logger.error(`Bookmark resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to bookmark resource",
    });
  }
};

// @desc    Unbookmark resource
// @route   DELETE /api/resources/:resourceId/bookmark
// @access  Private
exports.unbookmarkResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const user = await User.findById(req.user.id);

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== resourceId,
    );
    await user.save();

    res.json({
      success: true,
      message: "Resource unbookmarked successfully",
    });
  } catch (error) {
    logger.error(`Unbookmark resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unbookmark resource",
    });
  }
};

// @desc    Like resource
// @route   POST /api/resources/:resourceId/like
// @access  Private
exports.likeResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (!resource.likes) resource.likes = [];

    if (resource.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Resource already liked",
      });
    }

    resource.likes.push(req.user.id);
    await resource.save();

    res.json({
      success: true,
      message: "Resource liked successfully",
    });
  } catch (error) {
    logger.error(`Like resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to like resource",
    });
  }
};

// @desc    Unlike resource
// @route   DELETE /api/resources/:resourceId/like
// @access  Private
exports.unlikeResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);

    resource.likes = resource.likes.filter(
      (id) => id.toString() !== req.user.id,
    );
    await resource.save();

    res.json({
      success: true,
      message: "Resource unliked successfully",
    });
  } catch (error) {
    logger.error(`Unlike resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to unlike resource",
    });
  }
};

// @desc    Report resource
// @route   POST /api/resources/:resourceId/report
// @access  Private
exports.reportResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { reason, details } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const Report = require("../models/Report");
    await Report.create({
      targetType: "resource",
      targetId: resourceId,
      targetModel: "Resource",
      reporter: req.user.id,
      reason,
      details,
      status: "pending",
    });

    // Notify admin
    const User = require("../models/User");
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        type: "report",
        title: "Resource Reported",
        message: `${req.user.fullName} reported "${resource.title}"`,
        data: { resourceId },
        priority: "high",
      });
    }

    res.json({
      success: true,
      message: "Resource reported successfully",
    });
  } catch (error) {
    logger.error(`Report resource error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to report resource",
    });
  }
};

// @desc    Get similar resources
// @route   GET /api/resources/:resourceId/similar
// @access  Public
exports.getSimilarResources = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { limit = 10 } = req.query;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const similar = await Resource.find({
      category: resource.category,
      _id: { $ne: resourceId },
      status: "available",
      moderationStatus: "approved",
    })
      .limit(parseInt(limit))
      .populate("owner", "fullName username avatar rating")
      .sort({ rating: -1, views: -1 });

    res.json({
      success: true,
      similar,
    });
  } catch (error) {
    logger.error(`Get similar resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar resources",
    });
  }
};

// @desc    Check availability for dates
// @route   GET /api/resources/:resourceId/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { startDate, endDate } = req.query;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const isAvailable = await resource.isAvailableForDates(
      new Date(startDate),
      new Date(endDate),
    );
    const days = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
    );
    const price = resource.calculatePrice(days);

    res.json({
      success: true,
      available: isAvailable,
      days,
      price,
      totalPrice: price + (resource.deposit || 0),
    });
  } catch (error) {
    logger.error(`Check availability error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to check availability",
    });
  }
};

// @desc    Get trending resources
// @route   GET /api/resources/trending
// @access  Public
exports.getTrendingResources = async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trending = await Resource.aggregate([
      { $match: { moderationStatus: "approved", status: "available" } },
      {
        $lookup: {
          from: "exchanges",
          localField: "_id",
          foreignField: "resource",
          as: "exchanges",
        },
      },
      {
        $addFields: {
          requestCount: { $size: "$exchanges" },
          recentRequests: {
            $size: {
              $filter: {
                input: "$exchanges",
                as: "exchange",
                cond: { $gte: ["$$exchange.createdAt", weekAgo] },
              },
            },
          },
        },
      },
      { $sort: { recentRequests: -1, views: -1, rating: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          location: 1,
          price: 1,
          priceType: 1,
          images: { $slice: ["$images", 1] },
          rating: 1,
          views: 1,
          requestCount: 1,
          recentRequests: 1,
          "owner.fullName": 1,
          "owner.username": 1,
          "owner.avatar": 1,
          "owner.rating": 1,
        },
      },
    ]);

    res.json({
      success: true,
      trending,
    });
  } catch (error) {
    logger.error(`Get trending resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending resources",
    });
  }
};

// @desc    Get featured resources
// @route   GET /api/resources/featured
// @access  Public
exports.getFeaturedResources = async (req, res) => {
  try {
    const featured = await Resource.find({
      isFeatured: true,
      status: "available",
      moderationStatus: "approved",
    })
      .populate("owner", "fullName username avatar rating")
      .sort({ rating: -1, views: -1 })
      .limit(12);

    res.json({
      success: true,
      featured,
    });
  } catch (error) {
    logger.error(`Get featured resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured resources",
    });
  }
};

// @desc    Get categories with counts
// @route   GET /api/resources/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Resource.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          name: "$_id",
          count: 1,
          subcategories: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    logger.error(`Get categories error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// @desc    Get resource statistics
// @route   GET /api/resources/stats
// @access  Public
exports.getResourceStats = async (req, res) => {
  try {
    const [total, byCategory, byStatus, trending] = await Promise.all([
      Resource.countDocuments({ moderationStatus: "approved" }),
      Resource.aggregate([
        { $match: { moderationStatus: "approved" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Resource.aggregate([
        { $match: { moderationStatus: "approved" } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Resource.find({
        isTrending: true,
        moderationStatus: "approved",
      }).countDocuments(),
    ]);

    const avgPrice = await Resource.aggregate([
      { $match: { moderationStatus: "approved", priceType: "rental" } },
      { $group: { _id: null, avg: { $avg: "$price" } } },
    ]);

    res.json({
      success: true,
      stats: {
        total,
        trending,
        byCategory,
        byStatus,
        averagePrice: avgPrice[0]?.avg || 0,
      },
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};

// @desc    Get nearby resources
// @route   GET /api/resources/nearby
// @access  Public
exports.getNearbyResources = async (req, res) => {
  try {
    const { lat, lng, radius = 10, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude required",
      });
    }

    const resources = await Resource.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000,
        },
      },
      status: "available",
      moderationStatus: "approved",
    })
      .populate("owner", "fullName username avatar")
      .limit(parseInt(limit));

    res.json({
      success: true,
      resources,
    });
  } catch (error) {
    logger.error(`Get nearby resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby resources",
    });
  }
};
// @desc    Bulk delete resources (admin only)
// @route   DELETE /api/resources/bulk
// @access  Private/Admin
exports.bulkDeleteResources = async (req, res) => {
  try {
    const { resourceIds } = req.body;

    if (
      !resourceIds ||
      !Array.isArray(resourceIds) ||
      resourceIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Resource IDs array is required",
      });
    }

    // Check for active exchanges
    const Exchange = require("../models/Exchange");
    const activeExchanges = await Exchange.find({
      resource: { $in: resourceIds },
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeExchanges.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ${activeExchanges.length} resources with active exchanges`,
      });
    }

    // Soft delete resources
    await Resource.updateMany(
      { _id: { $in: resourceIds } },
      { status: "deleted", deletedAt: new Date() },
    );

    res.json({
      success: true,
      message: `${resourceIds.length} resources deleted successfully`,
    });
  } catch (error) {
    logger.error(`Bulk delete resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete resources",
    });
  }
};

// @desc    Search resources
// @route   GET /api/resources/search
// @access  Public
exports.searchResources = async (req, res) => {
  try {
    const {
      q,
      category,
      location,
      minPrice,
      maxPrice,
      sortBy = "relevance",
      limit = 50,
    } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const query = {
      $text: { $search: q },
      moderationStatus: "approved",
    };

    if (category && category !== "all") query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }

    let sort = {};
    if (sortBy === "relevance") {
      sort = { score: { $meta: "textScore" } };
    } else if (sortBy === "price_asc") {
      sort = { price: 1 };
    } else if (sortBy === "price_desc") {
      sort = { price: -1 };
    } else if (sortBy === "rating") {
      sort = { rating: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    const resources = await Resource.find(query, {
      score: { $meta: "textScore" },
    })
      .populate("owner", "fullName username avatar rating")
      .sort(sort)
      .limit(parseInt(limit));

    // Get search suggestions
    const suggestions = await Resource.aggregate([
      { $match: { moderationStatus: "approved" } },
      { $project: { title: 1, category: 1 } },
      { $limit: 100 },
      {
        $group: {
          _id: null,
          titles: { $addToSet: "$title" },
          categories: { $addToSet: "$category" },
        },
      },
    ]);

    res.json({
      success: true,
      resources,
      total: resources.length,
      suggestions: suggestions[0]?.titles?.slice(0, 10) || [],
      categories: suggestions[0]?.categories || [],
    });
  } catch (error) {
    logger.error(`Search resources error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};
