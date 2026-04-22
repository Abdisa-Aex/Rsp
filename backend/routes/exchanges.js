const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const exchangeController = require("../controllers/exchangeController");

// Routes
router.get("/", auth, exchangeController.getMyExchanges);
router.get("/:id", auth, exchangeController.getExchangeById);
router.put("/:id/status", auth, exchangeController.updateExchangeStatus);
router.post("/:id/return", auth, exchangeController.returnExchange); // ← ADD THIS (for return)
router.post("/:id/rate", auth, exchangeController.rateExchange); // ← ADD THIS (for rating)

// Remove or keep for backward compatibility
router.post("/:id/complete", auth, exchangeController.completeExchange); // ← Optional, for old code

module.exports = router;
