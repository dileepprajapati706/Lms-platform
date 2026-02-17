const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// ==================== LEARNER ROUTES ====================
// POST /api/queries - Create query (LEARNER)
router.post(
  "/",
  roleMiddleware("LEARNER"),
  queryController.createQuery
);

// GET /api/queries/my-queries - Learner view self queries
router.get(
  "/my-queries",
  roleMiddleware("LEARNER"),
  queryController.getMyQueries
);

// DELETE /api/queries/:id - Delete query (LEARNER self)
router.delete(
  "/:id",
  roleMiddleware("LEARNER"),
  queryController.deleteQuery
);

// ==================== OWNER & TRAINER ROUTES ====================
// GET /api/queries - Get all queries (OWNER, TRAINER)
router.get(
  "/",
  roleMiddleware("OWNER", "TRAINER"),
  queryController.getAllQueries
);

// GET /api/queries/course/:courseId - Get queries by course
router.get(
  "/course/:courseId",
  roleMiddleware("OWNER", "TRAINER"),
  queryController.getQueriesByCourse
);

// GET /api/queries/:id - Get query by ID (ALL)
router.get(
  "/:id",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  queryController.getQueryById
);

// PUT /api/queries/:id - Update query (LEARNER update question, OWNER/TRAINER reply)
router.put(
  "/:id",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  queryController.updateQuery
);

module.exports = router;