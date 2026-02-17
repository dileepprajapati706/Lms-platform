const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// GET /api/courses - Get all courses (OWNER, TRAINER, LEARNER can view)
router.get(
  "/",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  courseController.getAllCourses
);

// GET /api/courses/:id - Get single course
router.get(
  "/:id",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  courseController.getCourseById
);

// POST /api/courses - Create course (OWNER only)
router.post(
  "/",
  roleMiddleware("OWNER"),
  courseController.createCourse
);

// PUT /api/courses/:id - Update course (OWNER only)
router.put(
  "/:id",
  roleMiddleware("OWNER"),
  courseController.updateCourse
);

// DELETE /api/courses/:id - Delete course (OWNER only)
router.delete(
  "/:id",
  roleMiddleware("OWNER"),
  courseController.deleteCourse
);

module.exports = router;