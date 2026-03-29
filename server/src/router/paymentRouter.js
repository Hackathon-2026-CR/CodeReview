const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// Parse JSON body just for this route
router.post("/create-checkout", express.json(), paymentController.createCheckout);

// Need raw body for the Stripe webhook signature verification
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);

module.exports = router;
