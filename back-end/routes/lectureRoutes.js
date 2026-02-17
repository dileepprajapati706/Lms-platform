const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lectureController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes need authentication
router.use(authMiddleware);

// ==================== TRAINER ROUTES ====================
// GET /api/lectures/my-lectures - Trainer get self lectures
router.get(
  "/my-lectures",
  roleMiddleware("TRAINER"),
  lectureController.getMyLectures
);

// ==================== COMMON ROUTES ====================
// GET /api/lectures - Get all lectures (OWNER)
router.get(
  "/",
  roleMiddleware("OWNER"),
  lectureController.getAllLectures
);

// GET /api/lectures/course/:courseId - Get lectures by course (ALL)
router.get(
  "/course/:courseId",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  lectureController.getLecturesByCourse
);

// GET /api/lectures/:id - Get single lecture
router.get(
  "/:id",
  roleMiddleware("OWNER", "TRAINER", "LEARNER"),
  lectureController.getLectureById
);

// POST /api/lectures - Create lecture (OWNER, TRAINER)
router.post(
  "/",
  roleMiddleware("OWNER", "TRAINER"),
  lectureController.createLecture
);

// PUT /api/lectures/:id - Update lecture (OWNER full, TRAINER self)
router.put(
  "/:id",
  roleMiddleware("OWNER", "TRAINER"),
  lectureController.updateLecture
);

// DELETE /api/lectures/:id - Delete lecture (OWNER only)
router.delete(
  "/:id",
  roleMiddleware("OWNER"),
  lectureController.deleteLecture
);

module.exports = router;