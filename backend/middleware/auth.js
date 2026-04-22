const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logger } = require("../utils/logger");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token =
      req.header("x-auth-token") ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select(
      "-password -refreshTokens -verificationCode",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      const banMessage =
        user.bannedUntil && user.bannedUntil > new Date()
          ? `Account banned until ${user.bannedUntil.toLocaleDateString()}`
          : "Account has been permanently banned";
      return res.status(403).json({
        success: false,
        message: banMessage,
      });
    }

    // Check if token was issued before password change
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "Password was changed recently. Please log in again.",
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    // Update last active
    user.lastActive = new Date();
    user
      .save()
      .catch((err) => logger.error("Failed to update last active:", err));

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    logger.error(`Auth middleware error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
