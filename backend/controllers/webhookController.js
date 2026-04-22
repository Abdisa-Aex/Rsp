const User = require("../models/User");
const Exchange = require("../models/Exchange");
const Notification = require("../models/Notification");
const { logger } = require("../utils/logger");

// @desc    Handle Stripe webhook
// @route   POST /api/webhooks/stripe
// @access  Public (verified by signature)
exports.handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = req.body;

    // Verify webhook signature in production
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Update exchange payment status
        await Exchange.findOneAndUpdate(
          { paymentId: paymentIntent.id },
          { paymentStatus: "paid", paidAt: new Date() },
        );
        logger.info(`Stripe payment succeeded: ${paymentIntent.id}`);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await Exchange.findOneAndUpdate(
          { paymentId: failedPayment.id },
          { paymentStatus: "failed" },
        );
        logger.warn(`Stripe payment failed: ${failedPayment.id}`);
        break;

      case "charge.refunded":
        const refund = event.data.object;
        await Exchange.findOneAndUpdate(
          { paymentId: refund.payment_intent },
          { paymentStatus: "refunded", refundedAt: new Date() },
        );
        logger.info(`Stripe refund processed: ${refund.id}`);
        break;

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`Stripe webhook error: ${error.message}`);
    res.status(400).json({ error: "Webhook error" });
  }
};

// @desc    Handle PayPal webhook
// @route   POST /api/webhooks/paypal
// @access  Public (verified by signature)
exports.handlePayPalWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature in production
    // const paypal = require('@paypal/checkout-server-sdk');
    // Verify signature using PayPal SDK

    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        const capture = event.resource;
        await Exchange.findOneAndUpdate(
          { paymentId: capture.id },
          { paymentStatus: "paid", paidAt: new Date() },
        );
        logger.info(`PayPal payment completed: ${capture.id}`);
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        const refund = event.resource;
        await Exchange.findOneAndUpdate(
          { paymentId: refund.id },
          { paymentStatus: "refunded", refundedAt: new Date() },
        );
        logger.info(`PayPal refund processed: ${refund.id}`);
        break;

      default:
        logger.info(`Unhandled PayPal event type: ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`PayPal webhook error: ${error.message}`);
    res.status(400).json({ error: "Webhook error" });
  }
};

// @desc    Handle SendGrid webhook (email events)
// @route   POST /api/webhooks/sendgrid
// @access  Public
exports.handleSendGridWebhook = async (req, res) => {
  try {
    const events = req.body;

    for (const event of events) {
      switch (event.event) {
        case "bounce":
        case "dropped":
        case "spam_report":
          // Log email delivery issues
          logger.warn(
            `Email delivery issue: ${event.event} for ${event.email}`,
          );
          // Could update user email status if needed
          break;

        case "open":
        case "click":
          // Track email engagement
          logger.debug(`Email ${event.event} by ${event.email}`);
          break;

        default:
          logger.debug(`SendGrid event: ${event.event}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`SendGrid webhook error: ${error.message}`);
    res.status(400).json({ error: "Webhook error" });
  }
};

// @desc    Handle external provider webhook
// @route   POST /api/webhooks/external/:provider
// @access  Public (verified by token)
exports.handleExternalWebhook = async (req, res) => {
  try {
    const { provider } = req.params;
    const { token } = req.query;
    const payload = req.body;

    // Verify webhook token
    const expectedToken =
      process.env[`${provider.toUpperCase()}_WEBHOOK_TOKEN`];
    if (expectedToken && token !== expectedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    logger.info(`External webhook received from ${provider}`);

    // Handle based on provider
    switch (provider) {
      case "twilio":
        // Handle SMS status updates
        if (payload.MessageStatus) {
          logger.info(
            `SMS status: ${payload.MessageStatus} for ${payload.MessageSid}`,
          );
        }
        break;

      case "cloudinary":
        // Handle image upload notifications
        if (payload.event === "upload") {
          logger.info(`Cloudinary upload: ${payload.public_id}`);
        }
        break;

      default:
        logger.info(`Unhandled external provider: ${provider}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`External webhook error: ${error.message}`);
    res.status(400).json({ error: "Webhook error" });
  }
};
