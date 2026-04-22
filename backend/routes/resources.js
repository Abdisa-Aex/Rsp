
const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");
const resourceController = require("../controllers/resourceController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validate } = require("../middleware/validation");
const upload = require("../middleware/upload");

// Validation rules
const createResourceValidation = [
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
  body("deposit")
    .if(body("priceType").equals("deposit"))
    .isNumeric()
    .withMessage("Deposit must be a number")
    .isFloat({ min: 0 })
    .withMessage("Deposit must be positive"),
  body("condition")
    .optional()
    .isIn(["excellent", "good", "fair", "needs_repair"]),
  body("tags").optional().isArray(),
  body("availabilityStart").optional().isISO8601(),
  body("availabilityEnd").optional().isISO8601(),
];

const updateResourceValidation = [
  body("title").optional().trim().isLength({ min: 5, max: 200 }),
  body("status")
    .optional()
    .isIn(["available", "borrowed", "pending", "maintenance", "unavailable"]),
  body("price").optional().isNumeric(),
  body("condition")
    .optional()
    .isIn(["excellent", "good", "fair", "needs_repair"]),
];

const resourceIdParamValidation = [
  param("resourceId").isMongoId().withMessage("Invalid resource ID"),
];

const requestResourceValidation = [
  body("startDate").isISO8601().withMessage("Start date is required"),
  body("endDate").isISO8601().withMessage("End date is required"),
  body("message").optional().isLength({ max: 500 }),
];

// Routes

router.get("/", resourceController.getResources);
router.get("/search", resourceController.searchResources);
router.get("/trending", resourceController.getTrendingResources);
router.get("/featured", resourceController.getFeaturedResources);
router.get("/categories", resourceController.getCategories);
router.get("/stats", resourceController.getResourceStats); // Changed from getStats to getResourceStats
router.get("/nearby", resourceController.getNearbyResources);
router.get(
  "/:resourceId",
  resourceIdParamValidation,
  validate,
  resourceController.getResourceById,
);
router.get(
  "/:resourceId/similar",
  resourceIdParamValidation,
  validate,
  resourceController.getSimilarResources,
);
router.get(
  "/:resourceId/availability",
  resourceIdParamValidation,
  validate,
  resourceController.checkAvailability,
);
router.get("/stats", resourceController.getStats);
router.get("/analytics", auth, resourceController.getResourceAnalytics);
router.get("/recommended", auth, resourceController.getRecommendedResources);
router.get("/user/:userId", resourceController.getUserResources);
router.get("/slug/:slug", resourceController.getResourceBySlug);
// router.delete("/bulk", auth, admin, resourceController.bulkDeleteResources);
router.post(
  "/",
  auth,
  upload.array("images", 10),
  createResourceValidation,
  validate,
  resourceController.createResource,
);
router.put(
  "/:resourceId",
  auth,
  resourceIdParamValidation,
  validate,
  updateResourceValidation,
  validate,
  resourceController.updateResource,
);
router.delete(
  "/:resourceId",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.deleteResource,
);
router.post(
  "/:resourceId/request",
  auth,
  resourceIdParamValidation,
  validate,
  requestResourceValidation,
  validate,
  resourceController.requestResource,
);
router.post(
  "/:resourceId/views",
  resourceIdParamValidation,
  validate,
  resourceController.incrementViews, // Make sure this function exists
);
router.post(
  "/:resourceId/bookmark",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.bookmarkResource,
);
router.delete(
  "/:resourceId/bookmark",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.unbookmarkResource,
);
router.post(
  "/:resourceId/like",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.likeResource,
);
router.delete(
  "/:resourceId/like",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.unlikeResource,
);
router.post(
  "/:resourceId/report",
  auth,
  resourceIdParamValidation,
  validate,
  resourceController.reportResource,
);


module.exports = router;