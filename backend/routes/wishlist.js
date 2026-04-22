const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const wishlistController = require("../controllers/wishlistController");
const { validate, validateWishlist } = require("../middleware/validation");
// Add this at the top of the file, before other routes
router.get("/test", auth, (req, res) => {
  res.json({ success: true, message: "Wishlist route is working!", user: req.user.id });
});
router.get("/", auth, wishlistController.getWishlist);
router.post(
  "/",
  auth,
  validateWishlist,
  validate,
  wishlistController.addToWishlist,
);
router.delete("/:resourceId", auth, wishlistController.removeFromWishlist);
router.get("/check/:resourceId", auth, wishlistController.checkWishlist);

module.exports = router;
