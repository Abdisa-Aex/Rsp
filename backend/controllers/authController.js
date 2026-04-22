

const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../services/email");
const { sendNotificationByType } = require("../config/firebase");
const { logger } = require("../utils/logger");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      trustScore: user.trustScore,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Helper function for magic link verification
const verifyWithToken = async (token, email, res, isRedirect = false) => {
  const user = await User.findOne({
    email,
    verificationToken: token,
    isVerified: false,
  });

  if (!user) {
    if (isRedirect) {
      return {
        success: false,
        error: "Invalid or already used verification link",
      };
    }
    return res.status(400).json({
      success: false,
      message: "Invalid or already used verification link",
    });
  }

  if (user.verificationExpires < Date.now()) {
    if (isRedirect) {
      return { success: false, error: "Verification link has expired" };
    }
    return res.status(400).json({
      success: false,
      message: "Verification link has expired. Please request a new one.",
    });
  }

  // Update user
  user.isVerified = true;
  user.emailVerified = true;
  user.verificationToken = null;
  user.verificationExpires = null;
  await user.save();

  // Award points for verification
  await User.findByIdAndUpdate(user._id, {
    $inc: { points: 100 },
  });

  // Update user stats
  await user.updateStats();

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email, user.fullName, user.userType).catch((err) => {
    logger.error(`Failed to send welcome email: ${err.message}`);
  });

  // Generate tokens for auto-login
  const authToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  if (isRedirect) {
    return {
      success: true,
      token: authToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar,
        points: user.points,
        trustScore: user.trustScore,
        isVerified: user.isVerified,
        stats: user.stats,
      },
    };
  }

  return res.json({
    success: true,
    message: "Email verified successfully",
    token: authToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      userType: user.userType,
      avatar: user.avatar,
      points: user.points,
      trustScore: user.trustScore,
      isVerified: user.isVerified,
      stats: user.stats,
    },
  });
};

// @desc    Register new user (UPDATED for magic link with unique username + non-blocking email)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log("=== REGISTRATION ATTEMPT ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      fullName,
      email,
      password,
      userType,
      studentId,
      department,
      yearOfStudy,
      graduationYear,
      phone,
      campusAddress,
      roomNumber,
      referralCode,
      username: providedUsername,
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ========== UNIQUE USERNAME GENERATION ==========
    let finalUsername;

    if (providedUsername) {
      const existingUsername = await User.findOne({
        username: providedUsername,
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken. Please choose another one.",
        });
      }
      finalUsername = providedUsername;
    } else {
      let baseUsername = fullName
        .toLowerCase()
        .replace(/\s/g, "")
        .substring(0, 20);
      let finalUsernameTemp = baseUsername;
      let counter = 1;

      while (await User.findOne({ username: finalUsernameTemp })) {
        finalUsernameTemp = `${baseUsername}${counter}`;
        counter++;
      }
      finalUsername = finalUsernameTemp;
    }
    console.log("Generated username:", finalUsername);
    // ========== END UNIQUE USERNAME GENERATION ==========

    // Check student ID for students
    if (userType === "student" && studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Student ID already registered",
        });
      }
    }

    // Handle referral
    let referredBy = null;
    let referralBonus = 0;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        referralBonus = 100;
        await User.findByIdAndUpdate(referrer._id, {
          $inc: { points: 500 },
          $push: { referrals: referrer._id },
        });
      }
    }

    // Generate magic link token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    user = new User({
      fullName,
      username: finalUsername,
      email,
      password,
      userType: userType || "external",
      studentId: userType === "student" ? studentId : undefined,
      department,
      yearOfStudy,
      graduationYear,
      phone,
      campusAddress,
      roomNumber,
      verificationToken,
      verificationExpires,
      isVerified: false,
      emailVerified: false,
      referredBy,
      points: referralBonus,
    });

    await user.save();
    console.log("User saved successfully!");

    // Send email in background (NON-BLOCKING)
    sendVerificationEmail(email, fullName, verificationToken)
      .then(() => {
        logger.info(`✅ Verification email sent to ${email}`);
      })
      .catch((err) => {
        logger.error(`❌ Failed to send email to ${email}: ${err.message}`);
      });

    logger.info(
      `New user registered: ${email} with username: ${finalUsername}`,
    );

    // Return response immediately
    res.status(201).json({
      success: true,
      message:
        "Registration successful! Check your email for verification link.",
      userId: user._id,
      email,
      username: finalUsername,
    });
  } catch (error) {
    console.error("Registration error:", error);
    logger.error(`Registration error: ${error.message}`);

    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({
          success: false,
          message: "Username already taken. Please try a different name.",
        });
      }
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// @desc    Verify email with magic link (GET for redirect)
// @route   GET /api/auth/verify-email
// @access  Public
exports.verifyEmailMagicLink = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/verification-failed?error=invalid_link`,
      );
    }

    const result = await verifyWithToken(token, email, res, true);

    if (result.success) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/verification-success?token=${result.token}&refreshToken=${result.refreshToken}&email=${encodeURIComponent(email)}`,
      );
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/verification-failed?error=${encodeURIComponent(result.error)}`,
      );
    }
  } catch (error) {
    logger.error(`Magic link verification error: ${error.message}`);
    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/verification-failed?error=server_error`,
    );
  }
};

// @desc    Verify email (POST fallback for API calls)
// @route   POST /api/auth/verify
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Token and email are required",
      });
    }

    return await verifyWithToken(token, email, res, false);
  } catch (error) {
    logger.error(`Verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

// @desc    Resend verification email (UPDATED for magic link)
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    sendVerificationEmail(email, user.fullName, verificationToken)
      .then(() => {
        logger.info(`✅ Resent verification email to ${email}`);
      })
      .catch((err) => {
        logger.error(`Failed to resend email: ${err.message}`);
      });

    res.json({
      success: true,
      message: "New verification link sent to your email",
    });
  } catch (error) {
    logger.error(`Resend verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};

// @desc    Send magic link for login
// @route   POST /api/auth/magic-link
// @access  Public
exports.sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: "If your email is registered, you will receive a magic link",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email first. Check your inbox for verification link.",
      });
    }

    // Generate magic link token
    const magicToken = crypto.randomBytes(32).toString("hex");
    const magicExpires = Date.now() + 15 * 60 * 1000;

    user.magicToken = magicToken;
    user.magicExpires = magicExpires;
    await user.save();

    const magicLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/magic-login?token=${magicToken}&email=${encodeURIComponent(email)}`;

    // Use Gmail transporter instead of Resend
    const nodemailer = require("nodemailer");
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Your Magic Link - ResourceHub ✨",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Magic Link Login</h2>
          <p>Click the button below to log in instantly:</p>
          <a href="${magicLink}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Log In Instantly
          </a>
          <p>Or copy this link: ${magicLink}</p>
          <p>This link expires in 15 minutes.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
      text: `Magic Link Login: ${magicLink}\n\nExpires in 15 minutes.`,
    });

    logger.info(`Magic link sent to ${email}`);

    res.json({
      success: true,
      message: "Magic link sent! Check your email.",
    });
  } catch (error) {
    logger.error(`Magic link error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send magic link. Please try again.",
    });
  }
};

// @desc    Verify magic link and login
// @route   GET /api/auth/magic-link/verify
// @access  Public
exports.verifyMagicLink = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=invalid_link`,
      );
    }

    const user = await User.findOne({
      email,
      magicToken: token,
      magicExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=invalid_or_expired`,
      );
    }

    // Clear magic token
    user.magicToken = null;
    user.magicExpires = null;
    await user.save();

    // Generate JWT tokens
    const authToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    // Update last login
    user.lastLogin = new Date();
    user.online = true;
    await user.save();

    logger.info(`User logged in via magic link: ${email}`);

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/magic-login/success?token=${authToken}&refreshToken=${refreshToken}&email=${encodeURIComponent(email)}`,
    );
  } catch (error) {
    logger.error(`Magic link verify error: ${error.message}`);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=server_error`,
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, deviceInfo } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

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

    if (user.isLocked && user.isLocked()) {
      const remainingMinutes = Math.ceil(user.getLockoutRemaining() / 60000);
      return res.status(401).json({
        success: false,
        message: `Account locked. Please try again in ${remainingMinutes} minutes.`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (user.recordLoginAttempt) {
        await user.recordLoginAttempt(
          false,
          req.ip,
          req.headers["user-agent"],
          deviceInfo?.name,
        );
      }
      logger.warn(`Failed login attempt for ${email}`);

      const remainingAttempts = 5 - (user.loginAttempts?.count || 0);
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${remainingAttempts} attempts remaining.`,
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        needsVerification: true,
        email: user.email,
        message: "Please verify your email before logging in.",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        email: user.email,
        message: "Two-factor authentication required",
      });
    }

    if (user.recordLoginAttempt) {
      await user.recordLoginAttempt(
        true,
        req.ip,
        req.headers["user-agent"],
        deviceInfo?.name,
      );
    }

    user.lastLogin = new Date();
    user.online = true;
    await user.save();

    if (user.tokens) {
      user.tokens = user.tokens.filter((t) => t.expiresAt > new Date());
    }
    if (user.refreshTokens) {
      user.refreshTokens = user.refreshTokens.filter(
        (t) => t.expiresAt > new Date(),
      );
    }
    await user.save();

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push({
      token: refreshToken,
      device: deviceInfo?.name || "Unknown Device",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar,
        points: user.points,
        trustScore: user.trustScore,
        isVerified: user.isVerified,
        stats: user.stats,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// @desc    Verify 2FA
// @route   POST /api/auth/verify-2fa
// @access  Public
exports.verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const speakeasy = require("speakeasy");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Invalid 2FA code",
      });
    }

    user.lastLogin = new Date();
    user.online = true;
    await user.save();

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar,
        points: user.points,
        trustScore: user.trustScore,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    logger.error(`2FA verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "2FA verification failed",
    });
  }
};

// @desc    Enable 2FA
// @route   POST /api/auth/enable-2fa
// @access  Private
exports.enable2FA = async (req, res) => {
  try {
    const speakeasy = require("speakeasy");
    const QRCode = require("qrcode");

    const secret = speakeasy.generateSecret({
      name: `ResourceHub:${req.user.email}`,
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    await User.findByIdAndUpdate(req.user.id, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
    });

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: "Scan QR code with your authenticator app",
    });
  } catch (error) {
    logger.error(`Enable 2FA error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to enable 2FA",
    });
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private
exports.disable2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const speakeasy = require("speakeasy");

    const user = await User.findById(req.user.id);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Invalid 2FA code",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    });

    res.json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    logger.error(`Disable 2FA error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to disable 2FA",
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const tokenExists = user.refreshTokens.some(
      (t) => t.token === refreshToken,
    );
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const tokenRecord = user.refreshTokens.find(
      (t) => t.token === refreshToken,
    );
    if (tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken,
    );
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    if (Token) {
      await Token.findOneAndUpdate(
        { token: refreshToken },
        {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      );
    }

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { refreshTokens: { token: refreshToken } },
      });
      if (Token) {
        await Token.findOneAndDelete({ token: refreshToken });
      }
    } else if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { refreshTokens: [] },
      });
      if (Token) {
        await Token.deleteMany({ user: req.user.id });
      }
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        online: false,
        lastSeen: new Date(),
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select(
        "-password -refreshTokens -verificationToken -magicToken -twoFactorSecret",
      )
      .populate("badges");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
    });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      "fullName",
      "username",
      "bio",
      "phone",
      "location",
      "interests",
      "skills",
      "preferences",
      "sharingPreferences",
      "socialLinks",
      "campusAddress",
      "roomNumber",
    ];

    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (
      filteredUpdates.username &&
      filteredUpdates.username !== req.user.username
    ) {
      const existing = await User.findOne({
        username: filteredUpdates.username,
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: filteredUpdates },
      { new: true, runValidators: true },
    ).select(
      "-password -refreshTokens -verificationToken -magicToken -twoFactorSecret",
    );

    res.json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    user.password = newPassword;
    await user.save();

    await User.findByIdAndUpdate(req.user.id, {
      $set: { refreshTokens: [] },
    });
    if (Token) {
      await Token.deleteMany({ user: req.user.id });
    }

    await sendNotificationByType(req.user.id, "system", {
      message: "Your password was changed successfully.",
    });

    res.json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    if (Token) {
      await Token.create({
        user: user._id,
        type: "password_reset",
        token: resetToken,
        expiresAt: user.resetPasswordExpires,
      });
    }

    sendPasswordResetEmail(email, user.fullName, resetToken)
      .then(() => logger.info(`✅ Password reset email sent to ${email}`))
      .catch((err) =>
        logger.error(`Failed to send password reset email: ${err.message}`),
      );

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await User.findByIdAndUpdate(user._id, {
      $set: { refreshTokens: [] },
    });
    if (Token) {
      await Token.deleteMany({ user: user._id });
    }

    await sendNotificationByType(user._id, "system", {
      message: "Your password was reset successfully.",
    });

    res.json({
      success: true,
      message: "Password reset successfully. Please log in.",
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// @desc    Get user sessions
// @route   GET /api/auth/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("refreshTokens");

    const sessions = user.refreshTokens.map((token) => ({
      id: token._id,
      device: token.device,
      ip: token.ip,
      userAgent: token.userAgent,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      isCurrent: token.token === req.token,
    }));

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    logger.error(`Get sessions error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get sessions",
    });
  }
};

// @desc    Revoke session
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
exports.revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const user = await User.findById(req.user.id);
    const session = user.refreshTokens.id(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { refreshTokens: { _id: sessionId } },
    });
    if (Token) {
      await Token.findOneAndDelete({ token: session.token });
    }

    res.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    logger.error(`Revoke session error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to revoke session",
    });
  }
};

// @desc    Revoke all sessions
// @route   DELETE /api/auth/sessions
// @access  Private
exports.revokeAllSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const currentToken = req.token;

    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token === currentToken,
    );
    await user.save();

    if (Token) {
      await Token.deleteMany({
        user: req.user.id,
        token: { $ne: currentToken },
      });
    }

    res.json({
      success: true,
      message: "All other sessions revoked successfully",
    });
  } catch (error) {
    logger.error(`Revoke all sessions error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to revoke sessions",
    });
  }
};

// @desc    Request email change
// @route   POST /api/auth/request-email-change
// @access  Private
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    const existing = await User.findOne({ email: newEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await User.findById(req.user.id);
    const code = user.generateEmailChangeCode(newEmail);
    await user.save();

    await sendVerificationEmail(newEmail, user.fullName, code);

    res.json({
      success: true,
      message: "Verification email sent to new address",
    });
  } catch (error) {
    logger.error(`Request email change error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to request email change",
    });
  }
};

// @desc    Confirm email change
// @route   POST /api/auth/confirm-email-change
// @access  Private
exports.confirmEmailChange = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.emailChangePending || user.emailChangePending.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (user.emailChangePending.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    const newEmail = user.emailChangePending.newEmail;
    user.email = newEmail;
    user.emailChangePending = null;
    await user.save();

    await User.findByIdAndUpdate(user._id, {
      $set: { refreshTokens: [] },
    });

    res.json({
      success: true,
      message: "Email changed successfully. Please log in again.",
    });
  } catch (error) {
    logger.error(`Confirm email change error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to confirm email change",
    });
  }
};
