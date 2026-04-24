const mongoose = require("mongoose");

const Exchange = require("../models/Exchange");
const Resource = require("../models/Resource");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { logger } = require("../utils/logger");
const Activity = require("../models/Activity");
// const Resource = require("../models/Resource"); 
// const Activity = require("../models/Activity"); 
// @desc    Get all exchanges for current user
// @route   GET /api/exchanges
// @access  Private
exports.getMyExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ owner: req.user.id }, { borrower: req.user.id }],
    })
      .populate("resource", "title images category")
      .populate("owner", "fullName username avatar")
      .populate("borrower", "fullName username avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, exchanges });
  } catch (error) {
    logger.error("Get exchanges error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch exchanges" });
  }
};

// @desc    Get exchange by ID
// @route   GET /api/exchanges/:id
// @access  Private
exports.getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate("resource")
      .populate("owner", "fullName username avatar phone email")
      .populate("borrower", "fullName username avatar phone email");

    if (!exchange) {
      return res
        .status(404)
        .json({ success: false, message: "Exchange not found" });
    }

    // Check if user is part of this exchange
    if (
      exchange.owner._id.toString() !== req.user.id &&
      exchange.borrower._id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, exchange });
  } catch (error) {
    logger.error("Get exchange error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch exchange" });
  }
};

// @desc    Update exchange status
// @route   PUT /api/exchanges/:id/status
// @access  Private
exports.updateExchangeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const exchange = await Exchange.findById(req.params.id).populate("resource", "title");

    if (!exchange) {
      return res
        .status(404)
        .json({ success: false, message: "Exchange not found" });
    }

    const isOwner = exchange.owner.toString() === req.user.id;
    const isBorrower = exchange.borrower.toString() === req.user.id;

    console.log("Update exchange status:", {
      exchangeId: exchange._id,
      requestedStatus: status,
      isOwner,
      isBorrower,
      userId: req.user.id,
      ownerId: exchange.owner,
      borrowerId: exchange.borrower
    });

    // === PERMISSION CHECKS ===
    
    if (status === "approved" && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: "Only the item owner can approve requests" 
      });
    }

    if (status === "canceled" && !isOwner && !isBorrower) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to cancel this exchange" 
      });
    }

    if (status === "active" && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: "Only owner can activate exchange" 
      });
    }

    if (status === "completed" && !isOwner && !isBorrower) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to complete this exchange" 
      });
    }

    // === UPDATE STATUS ===
    exchange.status = status;
    
    if (status === "approved") exchange.approvedAt = new Date();
    if (status === "active") exchange.activatedAt = new Date();
    if (status === "completed") exchange.completedAt = new Date();
    if (status === "canceled") exchange.canceledAt = new Date();

    await exchange.save();

    // === SEND NOTIFICATION ===
    const recipientId = isOwner ? exchange.borrower : exchange.owner;
    const resourceTitle = exchange.resource?.title || "item";
    
    let notificationTitle = "";
    let notificationMessage = "";
    
    if (status === "approved") {
      notificationTitle = "Request Approved";
      notificationMessage = `${req.user.fullName} approved your request to borrow "${resourceTitle}"`;
    } else if (status === "canceled") {
      notificationTitle = "Request Declined";
      notificationMessage = `${req.user.fullName} declined your request to borrow "${resourceTitle}"`;
    } else {
      notificationTitle = `Exchange ${status}`;
      notificationMessage = `Your exchange has been ${status}`;
    }

    // ✅ FIXED: Use "request" type instead of "exchange"
    await Notification.create({
      user: recipientId,
      type: "request",  // ← Changed from "exchange" to "request"
      title: notificationTitle,
      message: notificationMessage,
      data: { exchangeId: exchange._id, status },
      priority: "high",
    });

    logger.info(`Exchange ${exchange._id} status updated to ${status} by ${req.user.id}`);

    res.json({ 
      success: true, 
      exchange,
      message: status === "approved" ? "Request approved successfully" : 
               status === "canceled" ? "Request declined successfully" : 
               "Exchange status updated"
    });
    
  } catch (error) {
    logger.error("Update exchange status error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to update exchange" 
    });
  }
};

// ==================== RETURN EXCHANGE ====================

// @desc    Return an item (complete exchange)
// @route   POST /api/exchanges/:id/return
// @access  Private
exports.returnExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, returnNotes, returnPhotos } = req.body;

    const exchange = await Exchange.findById(id);
    if (!exchange) {
      return res
        .status(404)
        .json({ success: false, message: "Exchange not found" });
    }

    // Check if user is the borrower
    if (exchange.borrower.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (exchange.status !== "active") {
      return res
        .status(400)
        .json({ success: false, message: "Exchange is not active" });
    }

    exchange.status = "completed";
    exchange.completedAt = new Date();
    exchange.returnCondition = condition;
    exchange.returnNotes = returnNotes;
    exchange.returnPhotos = returnPhotos || [];
    await exchange.save();

    // Update resource status
    const resource = await Resource.findByIdAndUpdate(exchange.resource, {
      status: "available",
    });

    // ✅ ADD RETURN ACTIVITY
    try {
      const Activity = require("../models/Activity");
      await Activity.create({
        user: req.user.id,
        action: "returned",
        item: resource.title,
        itemId: exchange.resource,
      });
      console.log("✅ Return activity created for user:", req.user.id);
    } catch (activityError) {
      console.error("Failed to create return activity:", activityError.message);
    }

    // Award points for returning
    await User.findByIdAndUpdate(exchange.borrower, {
      $inc: { points: 100, "stats.successfulExchanges": 1 },
    });
    await User.findByIdAndUpdate(exchange.owner, {
      $inc: { "stats.successfulExchanges": 1 },
    });

    // ✅ FIXED: Notify owner correctly
    await Notification.create({
      user: exchange.owner,  // ← Use exchange.owner directly
      type: "return",        // ← Use "return" type
      title: "Item Returned",
      message: `${req.user.fullName} has returned "${resource.title}"`,
      data: { exchangeId: exchange._id },
      priority: "high",
    });

    logger.info(`Exchange ${id} returned by ${req.user.id}`);
    res.json({ success: true, message: "Item returned successfully" });
  } catch (error) {
    logger.error("Return exchange error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== RATE EXCHANGE (KEEP ONLY THIS ONE) ====================

// @desc    Rate an exchange (add review)
// @route   POST /api/exchanges/:id/rate
// @access  Private
exports.rateExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, tags, isPublic } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid rating" });
    }

    const exchange = await Exchange.findById(id)
      .populate("resource", "title images")
      .populate("owner", "fullName email")
      .populate("borrower", "fullName email");

    if (!exchange) {
      return res
        .status(404)
        .json({ success: false, message: "Exchange not found" });
    }

    // Check if user is part of this exchange
    const isOwner = exchange.owner._id.toString() === req.user.id;
    const isBorrower = exchange.borrower._id.toString() === req.user.id;

    if (!isOwner && !isBorrower) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Check if exchange is completed
    if (exchange.status !== "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Exchange must be completed first" });
    }

    // Check if already rated
    if (
      (isOwner && exchange.ownerRating) ||
      (!isOwner && exchange.borrowerRating)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Already rated this exchange" });
    }

    // Add rating to exchange
    if (isOwner) {
      exchange.ownerRating = rating;
      exchange.ownerReview = review;
      exchange.ownerTags = tags;
      exchange.ownerRatedAt = new Date();
    } else {
      exchange.borrowerRating = rating;
      exchange.borrowerReview = review;
      exchange.borrowerTags = tags;
      exchange.borrowerRatedAt = new Date();
    }
    await exchange.save();

    // Award points for writing review (50 points)
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 50 } });

    // Create review in Review collection
    const Review = require("../models/Review");
    await Review.create({
      exchange: exchange._id,
      resource: exchange.resource._id,
      reviewer: req.user.id,
      reviewee: isOwner ? exchange.borrower._id : exchange.owner._id,
      rating,
      review,
      tags: tags || [],
      isPublic: isPublic !== false,
    });

    // Update reviewee's average rating
    const revieweeId = isOwner ? exchange.borrower._id : exchange.owner._id;
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : rating;
    await User.findByIdAndUpdate(revieweeId, {
      rating: avgRating,
      totalRatings: allReviews.length,
      $inc: { points: 25 },
    });

    // Create notification for the other party
    await Notification.create({
      user: isOwner ? exchange.borrower._id : exchange.owner._id,
      type: "review",
      title: "New Review",
      message: `${req.user.fullName} left you a ${rating}-star review`,
      data: { exchangeId: exchange._id, rating },
      priority: "medium",
      actionUrl: `/exchanges/${exchange._id}`,
    });

    logger.info(`Exchange ${id} rated by ${req.user.id} with ${rating} stars`);

    res.json({
      success: true,
      message: "Review submitted successfully",
      pointsEarned: 50,
    });
  } catch (error) {
    logger.error(`Rate exchange error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Complete exchange (legacy - kept for compatibility)
// @route   POST /api/exchanges/:id/complete
// @access  Private
exports.completeExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, condition } = req.body;
    
    const exchange = await Exchange.findById(id);
    if (!exchange) {
      return res.status(404).json({ success: false, message: "Exchange not found" });
    }

    if (exchange.status !== "active") {
      return res.status(400).json({ success: false, message: "Exchange is not active" });
    }

    exchange.status = "completed";
    exchange.completedAt = new Date();
    exchange.returnCondition = condition;
    await exchange.save();

    // Add review if provided
    if (rating && review) {
      const Review = require("../models/Review");
      const isOwner = exchange.owner.toString() === req.user.id;
      
      await Review.create({
        exchange: exchange._id,
        resource: exchange.resource,
        reviewer: req.user.id,
        reviewee: isOwner ? exchange.borrower : exchange.owner,
        rating,
        review,
        isPublic: true,
      });
    }

    // Update user stats
    await User.findByIdAndUpdate(exchange.owner, { $inc: { "stats.successfulExchanges": 1, points: 200 } });
    await User.findByIdAndUpdate(exchange.borrower, { $inc: { "stats.successfulExchanges": 1, points: 200 } });

    // Update resource status
    await Resource.findByIdAndUpdate(exchange.resource, { status: "available" });

    res.json({ success: true, message: "Exchange completed successfully" });
  } catch (error) {
    logger.error("Complete exchange error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};