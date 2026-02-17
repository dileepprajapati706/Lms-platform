const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ==================== INTERNAL USER AUTH ====================
// POST /api/auth/internal/register
router.post("/internal/register", authController.registerInternalUser);

// POST /api/auth/internal/login
router.post("/internal/login", authController.loginInternalUser);

// ==================== LEARNER AUTH ====================
// POST /api/auth/learner/register
router.post("/learner/register", authController.registerLearner);

// POST /api/auth/learner/login
router.post("/learner/login", authController.loginLearner);

module.exports = router;