const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const { validate } = require("../middleware/validation");
const auth = require("../middleware/auth");

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});

// Validation rules
const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("userType")
    .optional()
    .isIn(["student", "faculty", "alumni", "external"])
    .withMessage("Invalid user type"),
  body("studentId")
    .if(body("userType").equals("student"))
    .notEmpty()
    .withMessage("Student ID is required for students")
    .matches(/^[rR]\/\d{4}\/\d{2}$/)
    .withMessage("Student ID must be in format r/XXXX/XX (e.g., r/0074/13)"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

// FIXED: Removed confirmPassword validation
const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const verifyMagicLinkValidation = [
  body("token").notEmpty().withMessage("Verification token is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
];

// ============ MAGIC LINK VERIFICATION ROUTES ============

// Magic link verification (GET - for redirect from email)
router.get("/verify-email", authController.verifyEmailMagicLink);

// Magic link verification (POST - for API fallback)
router.post(
  "/verify",
  verifyMagicLinkValidation,
  validate,
  authController.verifyEmail,
);

// ============ MAGIC LINK LOGIN ROUTES ============

// Send magic link for login
router.post("/magic-link", authController.sendMagicLink);

// Verify magic link and login (GET for redirect)
router.get("/magic-link/verify", authController.verifyMagicLink);

// ============ AUTHENTICATION ROUTES ============

// Register
router.post("/register", registerValidation, validate, authController.register);

// Resend verification email
router.post("/resend-verification", authController.resendVerification);

// Login
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validate,
  authController.login,
);

// Logout
router.post("/logout", auth, authController.logout);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Forgot password
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword,
);

// Reset password - FIXED: removed confirmPassword validation
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  authController.resetPassword,
);

// Change password
router.post(
  "/change-password",
  auth,
  changePasswordValidation,
  validate,
  authController.changePassword,
);

// Get current user
router.get("/me", auth, authController.getMe);

// Update profile
router.put("/me", auth, authController.updateProfile);

// 2FA Routes
router.post("/verify-2fa", authController.verify2FA);
router.post("/enable-2fa", auth, authController.enable2FA);
router.post("/disable-2fa", auth, authController.disable2FA);

// Session management
router.get("/sessions", auth, authController.getSessions);
router.delete("/sessions/:sessionId", auth, authController.revokeSession);
router.delete("/sessions", auth, authController.revokeAllSessions);

// Email change
router.post("/request-email-change", auth, authController.requestEmailChange);
router.post("/confirm-email-change", auth, authController.confirmEmailChange);

// Check email availability
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const User = require("../models/User");
    const user = await User.findOne({ email });
    res.json({ available: !user });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ available: false, error: error.message });
  }
});

module.exports = router;
