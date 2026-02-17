const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// ==================== LEARNER ROUTES ====================
// POST /api/feedbacks - Create feedback (LEARNER)
router.post(
  "/",
  roleMiddleware("LEARNER"),
  feedbackController.createFeedback
);

// GET /api/feedbacks/my-feedbacks - Learner view self feedbacks
router.get(
  "/my-feedbacks",
  roleMiddleware("LEARNER"),
  feedbackController.getMyFeedbacks
);

// PUT /api/feedbacks/:id - Update feedback (LEARNER self)
router.put(
  "/:id",
  roleMiddleware("LEARNER"),
  feedbackController.updateFeedback
);

// DELETE /api/feedbacks/:id - Delete feedback (LEARNER self)
router.delete(
  "/:id",
  roleMiddleware("LEARNER"),
  feedbackController.deleteFeedback
);

// ==================== OWNER & TRAINER ROUTES ====================
// GET /api/feedbacks - Get all feedbacks (OWNER, TRAINER)
router.get(
  "/",
  roleMiddleware("OWNER", "TRAINER"),
  feedbackController.getAllFeedbacks
);

// GET /api/feedbacks/course/:courseId - Get feedbacks by course
router.get(
  "/course/:courseId",
  roleMiddleware("OWNER", "TRAINER"),
  feedbackController.getFeedbacksByCourse
);

// GET /api/feedbacks/:id - Get feedback by ID
router.get(
  "/:id",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  feedbackController.getFeedbackById
);

module.exports = router;