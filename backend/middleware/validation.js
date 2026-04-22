// // const { validationResult, body } = require("express-validator");

// // // Validation result handler
// // exports.validate = (req, res, next) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({
// //       success: false,
// //       message: "Validation failed",
// //       errors: errors.array().map((err) => ({
// //         field: err.param,
// //         message: err.msg,
// //         value: err.value,
// //       })),
// //     });
// //   }
// //   next();
// // };

// // // Validate ObjectId
// // exports.validateObjectId = (id) => {
// //   const mongoose = require("mongoose");
// //   return mongoose.Types.ObjectId.isValid(id);
// // };

// // // Sanitize input
// // exports.sanitize = (input) => {
// //   if (typeof input === "string") {
// //     return input.trim().replace(/[<>]/g, "").slice(0, 5000);
// //   }
// //   return input;
// // };

// // // Validation rules
// // exports.validationRules = {
// //   // User registration
// //   register: [
// //     body("fullName")
// //       .trim()
// //       .notEmpty()
// //       .withMessage("Full name is required")
// //       .isLength({ min: 2, max: 50 })
// //       .withMessage("Name must be 2-50 characters"),
// //     body("email")
// //       .isEmail()
// //       .withMessage("Please provide a valid email")
// //       .normalizeEmail(),
// //     body("password")
// //       .isLength({ min: 8 })
// //       .withMessage("Password must be at least 8 characters")
// //       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
// //       .withMessage(
// //         "Password must contain at least one uppercase letter, one lowercase letter, and one number",
// //       ),
// //     body("userType")
// //       .optional()
// //       .isIn(["student", "faculty", "alumni", "external"])
// //       .withMessage("Invalid user type"),
// //     body("studentId")
// //       .if(body("userType").equals("student"))
// //       .notEmpty()
// //       .withMessage("Student ID is required for students")
// //       .matches(/^JU-\d{4}-\d{4}$/i)
// //       .withMessage("Student ID must be in format JU-YYYY-XXXX"),
// //   ],

// //   // Login
// //   login: [
// //     body("email").isEmail().withMessage("Please provide a valid email"),
// //     body("password").notEmpty().withMessage("Password is required"),
// //   ],

// //   // Create resource
// //   createResource: [
// //     body("title")
// //       .trim()
// //       .notEmpty()
// //       .withMessage("Title is required")
// //       .isLength({ min: 5, max: 200 })
// //       .withMessage("Title must be 5-200 characters"),
// //     body("description")
// //       .trim()
// //       .notEmpty()
// //       .withMessage("Description is required")
// //       .isLength({ max: 5000 })
// //       .withMessage("Description cannot exceed 5000 characters"),
// //     body("category").notEmpty().withMessage("Category is required"),
// //     body("location").notEmpty().withMessage("Location is required"),
// //     body("priceType").optional().isIn(["free", "rental", "deposit", "barter"]),
// //     body("price")
// //       .if(body("priceType").equals("rental"))
// //       .isNumeric()
// //       .withMessage("Price must be a number")
// //       .isFloat({ min: 0 })
// //       .withMessage("Price must be positive"),
// //     body("condition")
// //       .optional()
// //       .isIn(["excellent", "good", "fair", "needs_repair"]),
// //   ],

// //   // Send message
// //   sendMessage: [
// //     body("conversationId").isMongoId().withMessage("Invalid conversation ID"),
// //     body("text")
// //       .optional()
// //       .trim()
// //       .isLength({ max: 5000 })
// //       .withMessage("Message too long"),
// //     body("type")
// //       .optional()
// //       .isIn([
// //         "text",
// //         "image",
// //         "video",
// //         "audio",
// //         "file",
// //         "location",
// //         "contact",
// //         "poll",
// //       ]),
// //   ],

// //   // Create conversation
// //   createConversation: [
// //     body("participantId")
// //       .optional()
// //       .isMongoId()
// //       .withMessage("Invalid participant ID"),
// //     body("type")
// //       .isIn(["direct", "group"])
// //       .withMessage("Invalid conversation type"),
// //     body("groupName")
// //       .if(body("type").equals("group"))
// //       .notEmpty()
// //       .withMessage("Group name is required")
// //       .isLength({ max: 100 })
// //       .withMessage("Group name too long"),
// //   ],
// // };

// const { validationResult, body, param, query } = require("express-validator");

// // Validation result handler
// exports.validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors: errors.array().map((err) => ({
//         field: err.param,
//         message: err.msg,
//         value: err.value,
//       })),
//     });
//   }
//   next();
// };

// // Validate ObjectId
// exports.validateObjectId = (id) => {
//   const mongoose = require("mongoose");
//   return mongoose.Types.ObjectId.isValid(id);
// };

// // Sanitize input
// exports.sanitize = (input) => {
//   if (typeof input === "string") {
//     return input.trim().replace(/[<>]/g, "").slice(0, 5000);
//   }
//   return input;
// };

// // ============ ADD THESE NEW VALIDATION RULES ============

// // Exchange validations
// exports.validateExchange = [
//   body("startDate")
//     .isISO8601()
//     .withMessage("Valid start date is required")
//     .custom((value) => {
//       if (new Date(value) < new Date()) {
//         throw new Error("Start date cannot be in the past");
//       }
//       return true;
//     }),
//   body("endDate")
//     .isISO8601()
//     .withMessage("Valid end date is required")
//     .custom((value, { req }) => {
//       if (new Date(value) <= new Date(req.body.startDate)) {
//         throw new Error("End date must be after start date");
//       }
//       return true;
//     }),
//   body("message")
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage("Message cannot exceed 500 characters"),
// ];

// // Review validations
// exports.validateReview = [
//   body("rating")
//     .isInt({ min: 1, max: 5 })
//     .withMessage("Rating must be between 1 and 5"),
//   body("review")
//     .notEmpty()
//     .withMessage("Review text is required")
//     .isLength({ min: 10, max: 1000 })
//     .withMessage("Review must be between 10 and 1000 characters"),
//   body("exchangeId").isMongoId().withMessage("Invalid exchange ID"),
// ];

// // Wishlist validations
// exports.validateWishlist = [
//   body("resourceId").isMongoId().withMessage("Invalid resource ID"),
// ];

// // Report validations
// exports.validateReport = [
//   body("reason")
//     .isIn(["spam", "inappropriate", "harassment", "fake", "other"])
//     .withMessage("Invalid report reason"),
//   body("details")
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage("Details cannot exceed 500 characters"),
// ];

// // Update profile validations (enhanced)
// exports.validateProfileUpdate = [
//   body("fullName")
//     .optional()
//     .trim()
//     .isLength({ min: 2, max: 50 })
//     .withMessage("Name must be 2-50 characters")
//     .matches(/^[a-zA-Z\s\-']+$/)
//     .withMessage(
//       "Name can only contain letters, spaces, hyphens, and apostrophes",
//     ),
//   body("username")
//     .optional()
//     .trim()
//     .isLength({ min: 3, max: 30 })
//     .withMessage("Username must be 3-30 characters")
//     .matches(/^[a-zA-Z0-9_]+$/)
//     .withMessage("Username can only contain letters, numbers, and underscores"),
//   body("bio")
//     .optional()
//     .isLength({ max: 500 })
//     .withMessage("Bio cannot exceed 500 characters"),
//   body("phone")
//     .optional()
//     .matches(/^(\+251|0)[9]\d{8}$/)
//     .withMessage("Please provide a valid Ethiopian phone number"),
//   body("location")
//     .optional()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage("Location cannot exceed 100 characters"),
//   body("interests")
//     .optional()
//     .isArray()
//     .withMessage("Interests must be an array"),
//   body("skills").optional().isArray().withMessage("Skills must be an array"),
// ];

// // Password validation
// exports.validatePassword = [
//   body("currentPassword")
//     .notEmpty()
//     .withMessage("Current password is required"),
//   body("newPassword")
//     .isLength({ min: 8 })
//     .withMessage("New password must be at least 8 characters")
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
//     .withMessage(
//       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//     ),
//   body("confirmPassword").custom((value, { req }) => {
//     if (value !== req.body.newPassword) {
//       throw new Error("Passwords do not match");
//     }
//     return true;
//   }),
// ];

// // Pagination validation
// exports.validatePagination = [
//   query("page")
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage("Page must be a positive integer")
//     .toInt(),
//   query("limit")
//     .optional()
//     .isInt({ min: 1, max: 100 })
//     .withMessage("Limit must be between 1 and 100")
//     .toInt(),
// ];

// // Search validation
// exports.validateSearch = [
//   query("q")
//     .optional()
//     .trim()
//     .isLength({ min: 2, max: 100 })
//     .withMessage("Search query must be between 2 and 100 characters"),
//   query("category")
//     .optional()
//     .isString()
//     .withMessage("Category must be a string"),
//   query("minPrice")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Minimum price must be a positive number")
//     .toFloat(),
//   query("maxPrice")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Maximum price must be a positive number")
//     .toFloat(),
//   query("minRating")
//     .optional()
//     .isFloat({ min: 0, max: 5 })
//     .withMessage("Rating must be between 0 and 5")
//     .toFloat(),
// ];

// // Resource filter validation
// exports.validateResourceFilters = [
//   query("category")
//     .optional()
//     .isString()
//     .withMessage("Category must be a string"),
//   query("status")
//     .optional()
//     .isIn(["available", "borrowed", "pending", "all"])
//     .withMessage("Invalid status filter"),
//   query("sortBy")
//     .optional()
//     .isIn(["createdAt", "price", "rating", "views", "distance"])
//     .withMessage("Invalid sort field"),
//   query("sortOrder")
//     .optional()
//     .isIn(["asc", "desc"])
//     .withMessage("Sort order must be asc or desc"),
// ];

// // Email validation
// exports.validateEmail = [
//   body("email")
//     .isEmail()
//     .withMessage("Please provide a valid email address")
//     .normalizeEmail(),
// ];

// // 2FA validation
// exports.validate2FA = [
//   body("code")
//     .isLength({ min: 6, max: 6 })
//     .withMessage("2FA code must be 6 digits")
//     .isNumeric()
//     .withMessage("2FA code must contain only numbers"),
// ];

// // Contact message validation
// exports.validateContactMessage = [
//   body("name")
//     .trim()
//     .notEmpty()
//     .withMessage("Name is required")
//     .isLength({ min: 2, max: 50 }),
//   body("email").isEmail().withMessage("Valid email is required"),
//   body("subject")
//     .trim()
//     .notEmpty()
//     .withMessage("Subject is required")
//     .isLength({ min: 5, max: 100 }),
//   body("message")
//     .trim()
//     .notEmpty()
//     .withMessage("Message is required")
//     .isLength({ min: 10, max: 2000 }),
// ];

// // ============ COMPOSITE VALIDATION RULES ============

// // Full resource creation validation (combines multiple rules)
// exports.validateFullResource = [
//   ...exports.validationRules.createResource,
//   body("images").optional().isArray().withMessage("Images must be an array"),
//   body("tags").optional().isArray().withMessage("Tags must be an array"),
//   body("availabilityStart")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid availability start date"),
//   body("availabilityEnd")
//     .optional()
//     .isISO8601()
//     .withMessage("Invalid availability end date")
//     .custom((value, { req }) => {
//       if (
//         req.body.availabilityStart &&
//         new Date(value) <= new Date(req.body.availabilityStart)
//       ) {
//         throw new Error("Availability end must be after start");
//       }
//       return true;
//     }),
// ];

// // Full user registration validation (includes all fields)
// exports.validateFullRegistration = [
//   ...exports.validationRules.register,
//   body("phone")
//     .optional()
//     .matches(/^(\+251|0)[9]\d{8}$/)
//     .withMessage("Please provide a valid Ethiopian phone number"),
//   body("department").optional().trim().isLength({ max: 100 }),
//   body("campusAddress").optional().trim().isLength({ max: 200 }),
// ];

// // ============ HELPER FUNCTIONS ============

// // Validate multiple files
// exports.validateFiles = (req, res, next) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "At least one file is required",
//     });
//   }

//   const maxSize = 10 * 1024 * 1024; // 10MB
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

//   for (const file of req.files) {
//     if (!allowedTypes.includes(file.mimetype)) {
//       return res.status(400).json({
//         success: false,
//         message: `File type ${file.mimetype} not allowed. Allowed: ${allowedTypes.join(", ")}`,
//       });
//     }

//     if (file.size > maxSize) {
//       return res.status(400).json({
//         success: false,
//         message: `File ${file.originalname} exceeds ${maxSize / (1024 * 1024)}MB limit`,
//       });
//     }
//   }

//   next();
// };

// // Validate single file
// exports.validateFile = (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "File is required",
//     });
//   }

//   const maxSize = 5 * 1024 * 1024; // 5MB for avatar
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

//   if (!allowedTypes.includes(req.file.mimetype)) {
//     return res.status(400).json({
//       success: false,
//       message: `File type not allowed. Allowed: ${allowedTypes.join(", ")}`,
//     });
//   }

//   if (req.file.size > maxSize) {
//     return res.status(400).json({
//       success: false,
//       message: `File exceeds ${maxSize / (1024 * 1024)}MB limit`,
//     });
//   }

//   next();
// };

// // Sanitize HTML content
// exports.sanitizeHtml = (text) => {
//   if (!text) return "";
//   return text
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
//     .replace(/on\w+="[^"]*"/g, "")
//     .replace(/javascript:/gi, "")
//     .trim();
// };

// // Validate and sanitize all string fields in request body
// exports.sanitizeRequestBody = (req, res, next) => {
//   if (req.body) {
//     Object.keys(req.body).forEach((key) => {
//       if (typeof req.body[key] === "string") {
//         req.body[key] = exports.sanitize(req.body[key]);
//       }
//     });
//   }
//   next();
// };
const { validationResult, body, param, query } = require("express-validator");

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

// Validate ObjectId
exports.validateObjectId = (id) => {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
};

// Sanitize input
exports.sanitize = (input) => {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "").slice(0, 5000);
  }
  return input;
};

// ============ VALIDATION RULES ============
exports.validationRules = {
  // User registration
  register: [
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
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    body("userType")
      .optional()
      .isIn(["student", "faculty", "alumni", "external"])
      .withMessage("Invalid user type"),
    body("studentId")
      .if(body("userType").equals("student"))
      .notEmpty()
      .withMessage("Student ID is required for students")
      .matches(/^JU-\d{4}-\d{4}$/i)
      .withMessage("Student ID must be in format JU-YYYY-XXXX"),
  ],

  // Login
  login: [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // Create resource
  createResource: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 5, max: 200 })
      .withMessage("Title must be 5-200 characters"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 5000 })
      .withMessage("Description cannot exceed 5000 characters"),
    body("category").notEmpty().withMessage("Category is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("priceType").optional().isIn(["free", "rental", "deposit", "barter"]),
    body("price")
      .if(body("priceType").equals("rental"))
      .isNumeric()
      .withMessage("Price must be a number")
      .isFloat({ min: 0 })
      .withMessage("Price must be positive"),
    body("condition")
      .optional()
      .isIn(["excellent", "good", "fair", "needs_repair"]),
  ],

  // Send message
  sendMessage: [
    body("conversationId").isMongoId().withMessage("Invalid conversation ID"),
    body("text")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Message too long"),
    body("type")
      .optional()
      .isIn([
        "text",
        "image",
        "video",
        "audio",
        "file",
        "location",
        "contact",
        "poll",
      ]),
  ],

  // Create conversation
  createConversation: [
    body("participantId")
      .optional()
      .isMongoId()
      .withMessage("Invalid participant ID"),
    body("type")
      .isIn(["direct", "group"])
      .withMessage("Invalid conversation type"),
    body("groupName")
      .if(body("type").equals("group"))
      .notEmpty()
      .withMessage("Group name is required")
      .isLength({ max: 100 })
      .withMessage("Group name too long"),
  ],
};

// ============ ADDITIONAL VALIDATION RULES ============

// Exchange validations
exports.validateExchange = [
  body("startDate")
    .isISO8601()
    .withMessage("Valid start date is required")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),
  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("message")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
];

// Review validations
exports.validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review must be between 10 and 1000 characters"),
  body("exchangeId").isMongoId().withMessage("Invalid exchange ID"),
];

// Wishlist validations
exports.validateWishlist = [
  body("resourceId").isMongoId().withMessage("Invalid resource ID"),
];

// Report validations
exports.validateReport = [
  body("reason")
    .isIn(["spam", "inappropriate", "harassment", "fake", "other"])
    .withMessage("Invalid report reason"),
  body("details")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Details cannot exceed 500 characters"),
];

// Update profile validations
exports.validateProfileUpdate = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters")
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("phone")
    .optional()
    .matches(/^(\+251|0)[9]\d{8}$/)
    .withMessage("Please provide a valid Ethiopian phone number"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
];

// Password validation
exports.validatePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Pagination validation
exports.validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

// Search validation
exports.validateSearch = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number")
    .toFloat(),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number")
    .toFloat(),
  query("minRating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5")
    .toFloat(),
];

// Resource filter validation
exports.validateResourceFilters = [
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  query("status")
    .optional()
    .isIn(["available", "borrowed", "pending", "all"])
    .withMessage("Invalid status filter"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "price", "rating", "views", "distance"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

// Email validation
exports.validateEmail = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

// 2FA validation
exports.validate2FA = [
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("2FA code must be 6 digits")
    .isNumeric()
    .withMessage("2FA code must contain only numbers"),
];

// Contact message validation
exports.validateContactMessage = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 }),
  body("email").isEmail().withMessage("Valid email is required"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 5, max: 100 }),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 }),
];

// ============ COMPOSITE VALIDATION RULES ============

// Full resource creation validation
exports.validateFullResource = [
  ...exports.validationRules.createResource,
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("availabilityStart")
    .optional()
    .isISO8601()
    .withMessage("Invalid availability start date"),
  body("availabilityEnd")
    .optional()
    .isISO8601()
    .withMessage("Invalid availability end date")
    .custom((value, { req }) => {
      if (
        req.body.availabilityStart &&
        new Date(value) <= new Date(req.body.availabilityStart)
      ) {
        throw new Error("Availability end must be after start");
      }
      return true;
    }),
];

// Full user registration validation
exports.validateFullRegistration = [
  ...exports.validationRules.register,
  body("phone")
    .optional()
    .matches(/^(\+251|0)[9]\d{8}$/)
    .withMessage("Please provide a valid Ethiopian phone number"),
  body("department").optional().trim().isLength({ max: 100 }),
  body("campusAddress").optional().trim().isLength({ max: 200 }),
];

// ============ FILE VALIDATION HELPERS ============

// Validate multiple files
exports.validateFiles = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one file is required",
    });
  }

  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  for (const file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type ${file.mimetype} not allowed. Allowed: ${allowedTypes.join(", ")}`,
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File ${file.originalname} exceeds ${maxSize / (1024 * 1024)}MB limit`,
      });
    }
  }

  next();
};

// Validate single file
exports.validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File is required",
    });
  }

  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: `File type not allowed. Allowed: ${allowedTypes.join(", ")}`,
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: `File exceeds ${maxSize / (1024 * 1024)}MB limit`,
    });
  }

  next();
};

// Sanitize HTML content
exports.sanitizeHtml = (text) => {
  if (!text) return "";
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "")
    .trim();
};

// Sanitize request body
exports.sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = exports.sanitize(req.body[key]);
      }
    });
  }
  next();
};