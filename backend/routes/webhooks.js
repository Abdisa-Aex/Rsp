const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const webhookController = require("../controllers/webhookController");

// Verify webhook signature
const verifyWebhook = (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const timestamp = req.headers["x-webhook-timestamp"];

  if (!signature || !timestamp) {
    return res.status(401).json({ error: "Missing signature" });
  }

  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  next();
};

// Payment webhooks
router.post("/stripe", verifyWebhook, webhookController.handleStripeWebhook);
router.post("/paypal", verifyWebhook, webhookController.handlePayPalWebhook);

// Email webhooks
router.post(
  "/sendgrid",
  verifyWebhook,
  webhookController.handleSendGridWebhook,
);

// External API webhooks
router.post(
  "/external/:provider",
  verifyWebhook,
  webhookController.handleExternalWebhook,
);

module.exports = router;
