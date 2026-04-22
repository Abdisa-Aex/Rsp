const User = require("../models/User");
const Resource = require("../models/Resource");
const { logger } = require("../utils/logger");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    console.log("Getting wishlist for user:", req.user.id);
    
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: {
        path: "owner",
        select: "fullName username avatar rating trustScore",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        wishlist: [],
      });
    }

    res.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    logger.error(`Get wishlist error: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch wishlist",
      wishlist: [] 
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { resourceId } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.wishlist) user.wishlist = [];

    if (user.wishlist.includes(resourceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already in wishlist" });
    }

    user.wishlist.push(resourceId);
    await user.save();

    res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    logger.error(`Add to wishlist error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Failed to add to wishlist" });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:resourceId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== resourceId);
    await user.save();

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    logger.error(`Remove from wishlist error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove from wishlist" });
  }
};

// @desc    Check if resource is in wishlist
// @route   GET /api/wishlist/check/:resourceId
// @access  Private
exports.checkWishlist = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const user = await User.findById(req.user.id);

    const isBookmarked = user.wishlist?.includes(resourceId) || false;

    res.json({ success: true, isBookmarked });
  } catch (error) {
    logger.error(`Check wishlist error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Failed to check wishlist" });
  }
};
