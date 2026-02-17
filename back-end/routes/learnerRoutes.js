const express = require("express");
const router = express.Router();
const learnerController = require("../controllers/learnerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// ==================== LEARNER SELF ROUTES ====================
// GET /api/learners/me - Learner get self profile
router.get(
  "/me",
  roleMiddleware("LEARNER"),
  learnerController.getSelfProfile
);

// PUT /api/learners/me - Learner update self profile
router.put(
  "/me",
  roleMiddleware("LEARNER"),
  learnerController.updateSelf
);

// ==================== OWNER ROUTES ====================
// GET /api/learners - Owner get all learners
router.get(
  "/",
  roleMiddleware("OWNER"),
  learnerController.getAllLearners
);

// GET /api/learners/:id - Owner get single learner
router.get(
  "/:id",
  roleMiddleware("OWNER"),
  learnerController.getLearnerById
);

// PUT /api/learners/:id - Owner update learner
router.put(
  "/:id",
  roleMiddleware("OWNER"),
  learnerController.updateLearner
);

// DELETE /api/learners/:id - Owner delete learner
router.delete(
  "/:id",
  roleMiddleware("OWNER"),
  learnerController.deleteLearner
);

module.exports = router;