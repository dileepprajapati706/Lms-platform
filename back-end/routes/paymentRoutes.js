const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// GET /api/payments - Get all payments (OWNER only)
router.get(
  "/",
  roleMiddleware("OWNER"),
  paymentController.getAllPayments
);

// GET /api/payments/my-payments - Learner view self payments
router.get(
  "/my-payments",
  roleMiddleware("LEARNER"),
  paymentController.getMyPayments
);

// GET /api/payments/:id - Get payment by ID (OWNER)
router.get(
  "/:id",
  roleMiddleware("OWNER"),
  paymentController.getPaymentById
);

module.exports = router;