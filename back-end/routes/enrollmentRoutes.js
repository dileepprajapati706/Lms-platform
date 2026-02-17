const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// ==================== LEARNER ROUTES ====================
// POST /api/enrollments - Enroll in a course (LEARNER)
router.post(
  "/",
  roleMiddleware("LEARNER"),
  enrollmentController.enrollInCourse
);

// GET /api/enrollments/my-enrollments - Learner view purchased courses
router.get(
  "/my-enrollments",
  roleMiddleware("LEARNER"),
  enrollmentController.getMyEnrollments
);

// ==================== OWNER ROUTES ====================
// GET /api/enrollments - Get all enrollments (OWNER)
router.get(
  "/",
  roleMiddleware("OWNER"),
  enrollmentController.getAllEnrollments
);

// GET /api/enrollments/course/:courseId - Get enrollments by course (OWNER, TRAINER)
router.get(
  "/course/:courseId",
  roleMiddleware("OWNER", "TRAINER"),
  enrollmentController.getEnrollmentsByCourse
);

// GET /api/enrollments/:id - Get enrollment by ID (OWNER)
router.get(
  "/:id",
  roleMiddleware("OWNER"),
  enrollmentController.getEnrollmentById
);

// PUT /api/enrollments/:id - Update enrollment (OWNER only)
router.put(
  "/:id",
  roleMiddleware("OWNER"),
  enrollmentController.updateEnrollment
);

// DELETE /api/enrollments/:id - Delete enrollment (OWNER only)
router.delete(
  "/:id",
  roleMiddleware("OWNER"),
  enrollmentController.deleteEnrollment
);

module.exports = router;